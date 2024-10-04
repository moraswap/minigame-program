import * as anchor from "@coral-xyz/anchor";
import { Minigame } from "../target/types/minigame";
import { assert, expect } from "chai";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { createAssociatedTokenAccount, createMint, mintToDestination, transferSOL, transferToken } from "./utils/token";
import { PublicKey } from "@solana/web3.js";
import { sleep, ZERO_BN } from "./utils/const";

function tokens(amount: string | number, decimals: number = 0): anchor.BN {
  return new anchor.BN(parseFloat(amount.toString()) * (10 ** decimals));
}

describe("minigame", () => {
  // Configure the client to use the local cluster.
  let provider = anchor.AnchorProvider.env();
  let connection = provider.connection;
  anchor.setProvider(provider);
  console.log("User wallet:", provider.wallet.publicKey.toString());

  const program = anchor.workspace.Minigame as anchor.Program<Minigame>;
  const config = anchor.web3.Keypair.generate();
  const dev_wallet = anchor.web3.Keypair.generate();
  console.log("dev_wallet", dev_wallet.publicKey.toString());

  const ticket_token_amount = tokens("1", 9); // 1 SOLO
  console.log("ticket_token_amount", ticket_token_amount.toString());
  const locked_token_amount = tokens("20000", 9); // 20000 M
  console.log("locked_token_amount", locked_token_amount.toString());
  const reward_token_amount = tokens("100000", 9); // 100000 M
  console.log("reward_token_amount", reward_token_amount.toString());
  const fee_rate = 20; // 0.2%
  const lock_time = new anchor.BN(24 * 60 * 60); // 24h
  const match_time = new anchor.BN(30); // 30s
  let ticket_token_mint: PublicKey;
  let locked_token_mint: PublicKey;
  let reward_token_mint: PublicKey;
  let ticket_token_user_vault: PublicKey;
  let locked_token_user_vault: PublicKey;
  let reward_token_user_vault: PublicKey;
  let reward_token_user2_vault: PublicKey;
  let transfer_authority;
  let ticket_token_vault;
  let locked_token_vault_pair;
  let locked_token_vault;
  let reward_token_vault_pair;
  let reward_token_vault;
  let pool_pair;
  let pool;

  before(async () => {
    ticket_token_mint = await createMint(provider, provider.wallet.publicKey); // SOLO
    console.log("Created Ticket Token:", ticket_token_mint.toString());
    locked_token_mint = await createMint(provider, provider.wallet.publicKey); // M
    console.log("Created Locked Token:", locked_token_mint.toString());
    reward_token_mint = locked_token_mint; // M
    console.log("Created Reward Token:", reward_token_mint.toString());

    // setup atas
    ticket_token_user_vault = await createAssociatedTokenAccount(provider, ticket_token_mint, provider.wallet.publicKey, provider.wallet.publicKey);
    console.log("ticket_token_user_vault", ticket_token_user_vault.toString());
    locked_token_user_vault = await createAssociatedTokenAccount(provider, locked_token_mint, provider.wallet.publicKey, provider.wallet.publicKey);
    console.log("locked_token_user_vault", locked_token_user_vault.toString());
    reward_token_user_vault = locked_token_user_vault;
    reward_token_user2_vault = await createAssociatedTokenAccount(provider, reward_token_mint, dev_wallet.publicKey, provider.wallet.publicKey);
    console.log("reward_token_user2_vault", reward_token_user2_vault.toString());

    [transfer_authority,] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("transfer_authority")],
      program.programId
    );
    console.log("transfer_authority", transfer_authority.toString());
    [ticket_token_vault,] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("ticket"), config.publicKey.toBuffer()],
      program.programId
    );
    console.log("ticket_token_vault", ticket_token_vault.toString());
    // [locked_token_vault,] = anchor.web3.PublicKey.findProgramAddressSync(
    //   [Buffer.from("locked"), config.publicKey.toBuffer()],
    //   program.programId
    // );
    locked_token_vault_pair = anchor.web3.Keypair.generate();
    locked_token_vault = locked_token_vault_pair.publicKey;
    console.log("locked_token_vault", locked_token_vault.toString());
    // [reward_token_vault,] = anchor.web3.PublicKey.findProgramAddressSync(
    //   [Buffer.from("reward"), config.publicKey.toBuffer()],
    //   program.programId
    // );
    reward_token_vault_pair = anchor.web3.Keypair.generate();
    reward_token_vault = reward_token_vault_pair.publicKey;
    console.log("reward_token_vault", reward_token_vault.toString());

    // let pool_index_seed = new anchor.BN(0).toBuffer("be", 2);
    // [pool,] = anchor.web3.PublicKey.findProgramAddressSync(
    //   [Buffer.from("pool"), config.publicKey.toBuffer(), locked_token_mint.toBuffer(), reward_token_mint.toBuffer()],
    //   program.programId
    // );
    pool_pair = anchor.web3.Keypair.generate();
    pool = pool_pair.publicKey;
    console.log("pool", pool.toString());

    // setup initial balance of tokens
    await mintToDestination(provider, ticket_token_mint, ticket_token_user_vault, tokens("1000000", 9)); // 1000000 SOLO
    await mintToDestination(provider, locked_token_mint, locked_token_user_vault, tokens("1000000", 9)); // 1000000 M
    await mintToDestination(provider, reward_token_mint, reward_token_user_vault, tokens("1000000", 9)); // 1000000 M
    await mintToDestination(provider, reward_token_mint, reward_token_user2_vault, tokens("5000000", 9)); // 10000000 M
    console.log("Mint tokens sucessfully");
  });

  it("Config should be initialized successfully", async () => {
    await program.methods
      .initializeConfig(
        provider.wallet.publicKey,
        provider.wallet.publicKey,
        ticket_token_amount,
        fee_rate,
        lock_time,
        match_time,
      )
      .accounts({
        config: config.publicKey,
        transferAuthority: transfer_authority,
        ticketTokenMint: ticket_token_mint,
        ticketTokenVault: ticket_token_vault,
        funder: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([config]).rpc();

    const config_data = await program.account.gameConfig.fetch(config.publicKey);
    assert(config_data.authority.equals(provider.wallet.publicKey));
    assert(config_data.operator.equals(provider.wallet.publicKey));
    assert(config_data.ticketTokenMint.equals(ticket_token_mint));
    assert(config_data.ticketTokenVault.equals(ticket_token_vault));
    assert(config_data.ticketTokenAmount.eq(ticket_token_amount));
    assert(config_data.feeRate == fee_rate);
    assert(config_data.lockTime.eq(lock_time));
    assert(config_data.matchTime.eq(match_time));
  });

  it("Other user cannot update authority!", async () => {
    let isFailed = false;
    try {
      await program.methods
        .updateAuthority()
        .accounts({
          config: config.publicKey,
          authority: dev_wallet.publicKey,
          newAuthority: dev_wallet.publicKey,
        })
        .signers([]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isFalse(_err instanceof anchor.AnchorError);
    }

    assert(isFailed);
  });

  it("Authority should be updated correctly!", async () => {
    await program.methods
      .updateAuthority()
      .accounts({
        config: config.publicKey,
        authority: provider.wallet.publicKey,
        newAuthority: dev_wallet.publicKey,
      })
      .signers([]).rpc();

    const config_data = await program.account.gameConfig.fetch(config.publicKey);
    assert(config_data.authority.equals(dev_wallet.publicKey));
  });

  it("Other user cannot update operator!", async () => {
    let isFailed = false;
    try {
      await program.methods
        .updateOperator()
        .accounts({
          config: config.publicKey,
          authority: provider.wallet.publicKey,
          newOperator: dev_wallet.publicKey,
        })
        .signers([]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "An address constraint was violated");
      assert(e.origin == "authority");
    }

    assert(isFailed);
  });

  it("Operator should be updated correctly!", async () => {
    await program.methods
      .updateOperator()
      .accounts({
        config: config.publicKey,
        authority: dev_wallet.publicKey,
        newOperator: dev_wallet.publicKey,
      })
      .signers([dev_wallet]).rpc();

    const config_data = await program.account.gameConfig.fetch(config.publicKey);
    assert(config_data.operator.equals(dev_wallet.publicKey));
  });

  it("Other user cannot create pool!", async () => {
    let isFailed = false;
    try {
      await program.methods
        .createPool()
        .accounts({
          config: config.publicKey,
          authority: provider.wallet.publicKey,
          pool: pool,
          lockedTokenMint: locked_token_mint,
          rewardTokenMint: reward_token_mint,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([pool_pair]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "An address constraint was violated");
      assert(e.origin == "authority");
    }

    assert(isFailed);
  });

  it("Pool should be added successfully", async () => {
    await transferSOL(provider, provider.wallet.publicKey, dev_wallet.publicKey, tokens("100", 9)); // 100 SOL
    await program.methods
      .createPool()
      .accounts({
        config: config.publicKey,
        authority: dev_wallet.publicKey,
        pool: pool,
        lockedTokenMint: locked_token_mint,
        rewardTokenMint: reward_token_mint,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([dev_wallet, pool_pair]).rpc();

    const pool_data = await program.account.pool.fetch(pool);
    assert(pool_data.lockedTokenMint.equals(locked_token_mint));
    assert(pool_data.rewardTokenMint.equals(reward_token_mint));
  });

  it("Other user cannot initialize pool!", async () => {
    let isFailed = false;
    try {
      await program.methods
        .initializePool(
          locked_token_amount,
          reward_token_amount,
        )
        .accounts({
          config: config.publicKey,
          authority: provider.wallet.publicKey,
          pool: pool,
          transferAuthority: transfer_authority,
          lockedTokenMint: locked_token_mint,
          lockedTokenVault: locked_token_vault,
          rewardTokenMint: reward_token_mint,
          rewardTokenVault: reward_token_vault,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([locked_token_vault_pair, reward_token_vault_pair]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "An address constraint was violated");
      assert(e.origin == "authority");
    }

    assert(isFailed);
  });

  it("Pool should be initialized successfully", async () => {
    await transferSOL(provider, provider.wallet.publicKey, dev_wallet.publicKey, tokens("100", 9)); // 100 SOL
    await program.methods
      .initializePool(
        locked_token_amount,
        reward_token_amount,
      )
      .accounts({
        config: config.publicKey,
        authority: dev_wallet.publicKey,
        pool: pool,
        transferAuthority: transfer_authority,
        lockedTokenMint: locked_token_mint,
        lockedTokenVault: locked_token_vault,
        rewardTokenMint: reward_token_mint,
        rewardTokenVault: reward_token_vault,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([dev_wallet, locked_token_vault_pair, reward_token_vault_pair]).rpc();

    const pool_data = await program.account.pool.fetch(pool);
    assert(pool_data.lockedTokenMint.equals(locked_token_mint));
    assert(pool_data.lockedTokenVault.equals(locked_token_vault));
    assert(pool_data.lockedTokenAmount.eq(locked_token_amount));
    assert(pool_data.rewardTokenMint.equals(reward_token_mint));
    assert(pool_data.rewardTokenVault.equals(reward_token_vault));
    assert(pool_data.rewardTokenAmount.eq(reward_token_amount));
  });

  it("Other user cannot update ticket token amount!", async () => {
    let isFailed = false;
    let new_ticket_token_amount = tokens("2", 9); // 2 SOLO
    try {
      await program.methods
        .updateTicketTokenAmount(new_ticket_token_amount)
        .accounts({
          config: config.publicKey,
          authority: provider.wallet.publicKey,
        })
        .signers([]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "An address constraint was violated");
      assert(e.origin == "authority");
    }

    assert(isFailed);
  });

  it("Ticket token amount should be updated correctly!", async () => {
    let new_ticket_token_amount = tokens("2", 9); // 2 SOLO
    await program.methods
      .updateTicketTokenAmount(new_ticket_token_amount)
      .accounts({
        config: config.publicKey,
        authority: dev_wallet.publicKey,
      })
      .signers([dev_wallet]).rpc();

    const config_data = await program.account.gameConfig.fetch(config.publicKey);
    assert(config_data.ticketTokenAmount.eq(new_ticket_token_amount));
  });

  it("Other user cannot update locked token amount!", async () => {
    let isFailed = false;
    let new_locked_token_amount = tokens("25000", 9); // 25000 M
    try {
      await program.methods
        .updateLockedTokenAmount(new_locked_token_amount)
        .accounts({
          config: config.publicKey,
          pool: pool,
          authority: provider.wallet.publicKey,
        })
        .signers([]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "An address constraint was violated");
      assert(e.origin == "authority");
    }

    assert(isFailed);
  });

  it("Locked token amount should be updated correctly!", async () => {
    let new_locked_token_amount = tokens("25000", 9); // 25000 M
    await program.methods
      .updateLockedTokenAmount(new_locked_token_amount)
      .accounts({
        config: config.publicKey,
        pool: pool,
        authority: dev_wallet.publicKey,
      })
      .signers([dev_wallet]).rpc();

    const pool_data = await program.account.pool.fetch(pool);
    assert(pool_data.lockedTokenAmount.eq(new_locked_token_amount));
  });

  it("Other user cannot update reward token amount!", async () => {
    let isFailed = false;
    let new_reward_token_amount = tokens("125000", 9); // 125000 M
    try {
      await program.methods
        .updateRewardTokenAmount(new_reward_token_amount)
        .accounts({
          config: config.publicKey,
          pool: pool,
          authority: provider.wallet.publicKey,
        })
        .signers([]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "An address constraint was violated");
      assert(e.origin == "authority");
    }

    assert(isFailed);
  });

  it("Reward token amount should be updated correctly!", async () => {
    let new_reward_token_amount = tokens("125000", 9); // 125000 M
    await program.methods
      .updateRewardTokenAmount(new_reward_token_amount)
      .accounts({
        config: config.publicKey,
        pool: pool,
        authority: dev_wallet.publicKey,
      })
      .signers([dev_wallet]).rpc();

    const pool_data = await program.account.pool.fetch(pool);
    assert(pool_data.rewardTokenAmount.eq(new_reward_token_amount));
  });

  it("Other user cannot update lock time!", async () => {
    let isFailed = false;
    let new_lock_time = new anchor.BN(30); // 30s
    try {
      await program.methods
        .updateLockTime(new_lock_time)
        .accounts({
          config: config.publicKey,
          authority: provider.wallet.publicKey,
        })
        .signers([]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "An address constraint was violated");
      assert(e.origin == "authority");
    }

    assert(isFailed);
  });

  it("Lock time should be updated correctly!", async () => {
    let new_lock_time = new anchor.BN(30); // 30s
    await program.methods
      .updateLockTime(new_lock_time)
      .accounts({
        config: config.publicKey,
        authority: dev_wallet.publicKey,
      })
      .signers([dev_wallet]).rpc();

    const config_data = await program.account.gameConfig.fetch(config.publicKey);
    assert(config_data.lockTime.eq(new_lock_time));
  });

  it("Other user cannot update match time!", async () => {
    let isFailed = false;
    let new_match_time = new anchor.BN(35); // 35s
    try {
      await program.methods
        .updateMatchTime(new_match_time)
        .accounts({
          config: config.publicKey,
          authority: provider.wallet.publicKey,
        })
        .signers([]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "An address constraint was violated");
      assert(e.origin == "authority");
    }

    assert(isFailed);
  });

  it("Match time should be updated correctly!", async () => {
    let new_match_time = new anchor.BN(35); // 35s
    await program.methods
      .updateMatchTime(new_match_time)
      .accounts({
        config: config.publicKey,
        authority: dev_wallet.publicKey,
      })
      .signers([dev_wallet]).rpc();

    const config_data = await program.account.gameConfig.fetch(config.publicKey);
    assert(config_data.matchTime.eq(new_match_time));
  });

  it("Reward token should be deposited correctly!", async () => {
    const balancefrom_before = (await connection.getTokenAccountBalance(reward_token_user2_vault)).value.amount;
    const balanceto_before = (await connection.getTokenAccountBalance(reward_token_vault)).value.amount;
    const amount = tokens(2000000, 9);
    await program.methods
      .depositRewardToken(amount)
      .accounts({
        config: config.publicKey,
        pool: pool,
        rewardTokenFromVault: reward_token_user2_vault,
        rewardTokenVault: reward_token_vault,
        funder: dev_wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([dev_wallet]).rpc();

    const balancefrom_after = (await connection.getTokenAccountBalance(reward_token_user2_vault)).value.amount;
    const balanceto_after = (await connection.getTokenAccountBalance(reward_token_vault)).value.amount;
    assert(balancefrom_after == (new anchor.BN(balancefrom_before)).sub(amount).toString());
    assert(balanceto_after == (new anchor.BN(balanceto_before)).add(amount).toString());
  });

  it("Other user cannot withdraw reward tokens!", async () => {
    let isFailed = false;
    const amount = tokens("2000000", 9);
    try {
      await program.methods
        .withdrawRewardToken(amount)
        .accounts({
          config: config.publicKey,
          pool: pool,
          authority: provider.wallet.publicKey,
          transferAuthority: transfer_authority,
          rewardTokenToVault: reward_token_user_vault,
          rewardTokenVault: reward_token_vault,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "An address constraint was violated");
      assert(e.origin == "authority");
    }

    assert(isFailed);
  });

  it("Cannot withdraw more than balance!", async () => {
    let isFailed = false;
    const amount = tokens("2000001", 9);
    try {
      await program.methods
        .withdrawRewardToken(amount)
        .accounts({
          config: config.publicKey,
          pool: pool,
          authority: dev_wallet.publicKey,
          transferAuthority: transfer_authority,
          rewardTokenToVault: reward_token_user_vault,
          rewardTokenVault: reward_token_vault,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([dev_wallet]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isFalse(_err instanceof anchor.AnchorError);
    }

    assert(isFailed);
  });

  it("Reward token should be withdrawn correctly!", async () => {
    const balancefrom_before = (await connection.getTokenAccountBalance(reward_token_vault)).value.amount;
    const balanceto_before = (await connection.getTokenAccountBalance(reward_token_user_vault)).value.amount;
    const amount = tokens(1000, 9);
    await program.methods
      .withdrawRewardToken(amount)
      .accounts({
        config: config.publicKey,
        pool: pool,
        authority: dev_wallet.publicKey,
        transferAuthority: transfer_authority,
        rewardTokenToVault: reward_token_user_vault,
        rewardTokenVault: reward_token_vault,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([dev_wallet]).rpc();
    const balancefrom_after = (await connection.getTokenAccountBalance(reward_token_vault)).value.amount;
    const balanceto_after = (await connection.getTokenAccountBalance(reward_token_user_vault)).value.amount;
    assert(balancefrom_after == (new anchor.BN(balancefrom_before)).sub(amount).toString());
    assert(balanceto_after == (new anchor.BN(balanceto_before)).add(amount).toString());
  });

  it("Other user cannot pause/resume!", async () => {
    let isFailed = false;
    try {
      await program.methods
        .pauseOrResume()
        .accounts({
          config: config.publicKey,
          pool: pool,
          authority: provider.wallet.publicKey,
        })
        .signers([]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "An address constraint was violated");
      assert(e.origin == "authority");
    }

    assert(isFailed);
  });

  it("Pause/Resume correctly!", async () => {
    await program.methods
      .pauseOrResume()
      .accounts({
        config: config.publicKey,
        pool: pool,
        authority: dev_wallet.publicKey,
      })
      .signers([dev_wallet]).rpc();

    const pool_data = await program.account.pool.fetch(pool);
    assert(pool_data.isPause);
  });

  it("Cannot play while paused!", async () => {
    let isFailed = false;
    try {
      const match_mint_keypair = anchor.web3.Keypair.generate();
      const match_mint = match_mint_keypair.publicKey;
      const [match_account,] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("match"), match_mint.toBuffer()],
        program.programId
      );

      await program.methods
        .play()
        .accounts({
          config: config.publicKey,
          pool: pool,
          playmatch: match_account,
          matchMint: match_mint,
          ticketTokenVault: ticket_token_vault,
          lockedTokenVault: locked_token_vault,
          ticketTokenUserVault: ticket_token_user_vault,
          lockedTokenUserVault: locked_token_user_vault,
          funder: provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([match_mint_keypair]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "Paused");
    }

    assert(isFailed);
  });

  it("Should play correctly!", async () => {
    await program.methods
      .pauseOrResume()
      .accounts({
        config: config.publicKey,
        pool: pool,
        authority: dev_wallet.publicKey,
      })
      .signers([dev_wallet]).rpc();

    const ticket_balancefrom_before = (await connection.getTokenAccountBalance(ticket_token_user_vault)).value.amount;
    const ticket_balanceto_before = (await connection.getTokenAccountBalance(ticket_token_vault)).value.amount;
    const locked_balancefrom_before = (await connection.getTokenAccountBalance(locked_token_user_vault)).value.amount;
    const locked_balanceto_before = (await connection.getTokenAccountBalance(locked_token_vault)).value.amount;

    const config_data = await program.account.gameConfig.fetch(config.publicKey);
    const pool_data = await program.account.pool.fetch(pool);
    const matchs_before = await program.account.playMatch.all();
    const match_mint_keypair = anchor.web3.Keypair.generate();
    const match_mint = match_mint_keypair.publicKey;
    const [match_account,] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("match"), match_mint.toBuffer()],
      program.programId
    );

    await program.methods
      .play()
      .accounts({
        config: config.publicKey,
        pool: pool,
        playmatch: match_account,
        matchMint: match_mint,
        ticketTokenVault: ticket_token_vault,
        lockedTokenVault: locked_token_vault,
        ticketTokenUserVault: ticket_token_user_vault,
        lockedTokenUserVault: locked_token_user_vault,
        funder: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([match_mint_keypair]).rpc();

    const matchs_after = await program.account.playMatch.all();
    assert(matchs_after.length == matchs_before.length + 1);
    const ticket_balancefrom_after = (await connection.getTokenAccountBalance(ticket_token_user_vault)).value.amount;
    const ticket_balanceto_after = (await connection.getTokenAccountBalance(ticket_token_vault)).value.amount;
    const locked_balancefrom_after = (await connection.getTokenAccountBalance(locked_token_user_vault)).value.amount;
    const locked_balanceto_after = (await connection.getTokenAccountBalance(locked_token_vault)).value.amount;
    assert(ticket_balancefrom_after == (new anchor.BN(ticket_balancefrom_before)).sub(config_data.ticketTokenAmount).toString());
    assert(ticket_balanceto_after == (new anchor.BN(ticket_balanceto_before)).add(config_data.ticketTokenAmount).toString());
    assert(locked_balancefrom_after == (new anchor.BN(locked_balancefrom_before)).sub(pool_data.lockedTokenAmount).toString());
    assert(locked_balanceto_after == (new anchor.BN(locked_balanceto_before)).add(pool_data.lockedTokenAmount).toString());
  });

  it("Should play more correctly!", async () => {
    const ticket_balancefrom_before = (await connection.getTokenAccountBalance(ticket_token_user_vault)).value.amount;
    const ticket_balanceto_before = (await connection.getTokenAccountBalance(ticket_token_vault)).value.amount;
    const locked_balancefrom_before = (await connection.getTokenAccountBalance(locked_token_user_vault)).value.amount;
    const locked_balanceto_before = (await connection.getTokenAccountBalance(locked_token_vault)).value.amount;

    const config_data = await program.account.gameConfig.fetch(config.publicKey);
    const pool_data = await program.account.pool.fetch(pool);
    const matchs_before = await program.account.playMatch.all();
    const match_mint_keypair = anchor.web3.Keypair.generate();
    const match_mint = match_mint_keypair.publicKey;
    const [match_account,] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("match"), match_mint.toBuffer()],
      program.programId
    );

    await program.methods
      .play()
      .accounts({
        config: config.publicKey,
        pool: pool,
        playmatch: match_account,
        matchMint: match_mint,
        ticketTokenVault: ticket_token_vault,
        lockedTokenVault: locked_token_vault,
        ticketTokenUserVault: ticket_token_user_vault,
        lockedTokenUserVault: locked_token_user_vault,
        funder: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([match_mint_keypair]).rpc();

    const matchs_after = await program.account.playMatch.all();
    assert(matchs_after.length == matchs_before.length + 1);
    const ticket_balancefrom_after = (await connection.getTokenAccountBalance(ticket_token_user_vault)).value.amount;
    const ticket_balanceto_after = (await connection.getTokenAccountBalance(ticket_token_vault)).value.amount;
    const locked_balancefrom_after = (await connection.getTokenAccountBalance(locked_token_user_vault)).value.amount;
    const locked_balanceto_after = (await connection.getTokenAccountBalance(locked_token_vault)).value.amount;
    assert(ticket_balancefrom_after == (new anchor.BN(ticket_balancefrom_before)).sub(config_data.ticketTokenAmount).toString());
    assert(ticket_balanceto_after == (new anchor.BN(ticket_balanceto_before)).add(config_data.ticketTokenAmount).toString());
    assert(locked_balancefrom_after == (new anchor.BN(locked_balancefrom_before)).sub(pool_data.lockedTokenAmount).toString());
    assert(locked_balanceto_after == (new anchor.BN(locked_balanceto_before)).add(pool_data.lockedTokenAmount).toString());
  });

  it("Other user cannot fulfill!", async () => {
    let isFailed = false;
    try {
      const matchs = await program.account.playMatch.all();
      const match = matchs[0];
      await program.methods
        .fulfill(true)
        .accounts({
          config: config.publicKey,
          pool: pool,
          operator: provider.wallet.publicKey,
          playmatch: match.publicKey,
          transferAuthority: transfer_authority,
          ticketTokenMint: ticket_token_mint,
          ticketTokenVault: ticket_token_vault,
          lockedTokenVault: locked_token_vault,
          rewardTokenVault: reward_token_vault,
          ticketTokenUserVault: ticket_token_user_vault,
          lockedTokenUserVault: locked_token_user_vault,
          rewardTokenUserVault: reward_token_user_vault,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "An address constraint was violated");
      assert(e.origin == "operator");
    }

    assert(isFailed);
  });

  it("Cannot fulfill early!", async () => {
    let isFailed = false;
    try {
      const matchs = await program.account.playMatch.all();
      const match = matchs[0];
      await program.methods
        .fulfill(true)
        .accounts({
          config: config.publicKey,
          pool: pool,
          operator: dev_wallet.publicKey,
          playmatch: match.publicKey,
          transferAuthority: transfer_authority,
          ticketTokenMint: ticket_token_mint,
          ticketTokenVault: ticket_token_vault,
          lockedTokenVault: locked_token_vault,
          rewardTokenVault: reward_token_vault,
          ticketTokenUserVault: ticket_token_user_vault,
          lockedTokenUserVault: locked_token_user_vault,
          rewardTokenUserVault: reward_token_user_vault,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([dev_wallet]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "TooEarly");
    }

    assert(isFailed);
  });

  it("Should fulfill Win correctly!", async () => {
    await sleep(36 * 1000);

    const ticket_balancefrom_before = (await connection.getTokenAccountBalance(ticket_token_vault)).value.amount;
    const ticket_balanceto_before = (await connection.getTokenAccountBalance(ticket_token_user_vault)).value.amount;
    const locked_balancefrom_before = (await connection.getTokenAccountBalance(locked_token_vault)).value.amount;
    const reward_balancefrom_before = (await connection.getTokenAccountBalance(reward_token_vault)).value.amount;
    const locked_balanceto_before = (await connection.getTokenAccountBalance(locked_token_user_vault)).value.amount;

    const matchs = await program.account.playMatch.all();
    const match = matchs[0];
    await program.methods
      .fulfill(true)
      .accounts({
        config: config.publicKey,
        pool: pool,
        operator: dev_wallet.publicKey,
        playmatch: match.publicKey,
        transferAuthority: transfer_authority,
        ticketTokenMint: ticket_token_mint,
        ticketTokenVault: ticket_token_vault,
        lockedTokenVault: locked_token_vault,
        rewardTokenVault: reward_token_vault,
        ticketTokenUserVault: ticket_token_user_vault,
        lockedTokenUserVault: locked_token_user_vault,
        rewardTokenUserVault: reward_token_user_vault,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([dev_wallet]).rpc();

    const matchs_after = await program.account.playMatch.all();
    const match_after = matchs_after[0];
    assert(match_after.account.unlockTime.eq(ZERO_BN));

    const ticket_balancefrom_after = (await connection.getTokenAccountBalance(ticket_token_vault)).value.amount;
    const ticket_balanceto_after = (await connection.getTokenAccountBalance(ticket_token_user_vault)).value.amount;
    const locked_balancefrom_after = (await connection.getTokenAccountBalance(locked_token_vault)).value.amount;
    const reward_balancefrom_after = (await connection.getTokenAccountBalance(reward_token_vault)).value.amount;
    const locked_balanceto_after = (await connection.getTokenAccountBalance(locked_token_user_vault)).value.amount;

    assert(ticket_balancefrom_after == (new anchor.BN(ticket_balancefrom_before)).sub(match.account.ticketTokenAmount).toString());
    assert(ticket_balanceto_after == ticket_balanceto_before);
    assert(locked_balancefrom_after == (new anchor.BN(locked_balancefrom_before)).sub(match.account.lockedTokenAmount).toString());
    assert(reward_balancefrom_after == (new anchor.BN(reward_balancefrom_before)).sub(match.account.rewardTokenAmount).toString());
    assert(locked_balanceto_after == (new anchor.BN(locked_balanceto_before)).add(match.account.lockedTokenAmount).add(match.account.rewardTokenAmount).toString());
  });

  it("Cannot fulfill 1 won match again!", async () => {
    let isFailed = false;
    try {
      const matchs = await program.account.playMatch.all();
      const match = matchs[0];
      await program.methods
        .fulfill(true)
        .accounts({
          config: config.publicKey,
          pool: pool,
          operator: dev_wallet.publicKey,
          playmatch: match.publicKey,
          transferAuthority: transfer_authority,
          ticketTokenMint: ticket_token_mint,
          ticketTokenVault: ticket_token_vault,
          lockedTokenVault: locked_token_vault,
          rewardTokenVault: reward_token_vault,
          ticketTokenUserVault: ticket_token_user_vault,
          lockedTokenUserVault: locked_token_user_vault,
          rewardTokenUserVault: reward_token_user_vault,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([dev_wallet]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "Fulfilled");
    }

    assert(isFailed);
  });

  it("Should fulfill Lose correctly!", async () => {
    const ticket_balancefrom_before = (await connection.getTokenAccountBalance(ticket_token_vault)).value.amount;
    const ticket_balanceto_before = (await connection.getTokenAccountBalance(ticket_token_user_vault)).value.amount;
    const locked_balancefrom_before = (await connection.getTokenAccountBalance(locked_token_vault)).value.amount;
    const reward_balancefrom_before = (await connection.getTokenAccountBalance(reward_token_vault)).value.amount;
    const locked_balanceto_before = (await connection.getTokenAccountBalance(locked_token_user_vault)).value.amount;

    const config_data = await program.account.gameConfig.fetch(config.publicKey);
    const matchs = await program.account.playMatch.all();
    const match = matchs[1];
    const now = Math.floor(Date.now() / 1000);
    const expected_unlock_time = config_data.lockTime.add(new anchor.BN(now));
    await program.methods
      .fulfill(false)
      .accounts({
        config: config.publicKey,
        pool: pool,
        operator: dev_wallet.publicKey,
        playmatch: match.publicKey,
        transferAuthority: transfer_authority,
        ticketTokenMint: ticket_token_mint,
        ticketTokenVault: ticket_token_vault,
        lockedTokenVault: locked_token_vault,
        rewardTokenVault: reward_token_vault,
        ticketTokenUserVault: ticket_token_user_vault,
        lockedTokenUserVault: locked_token_user_vault,
        rewardTokenUserVault: reward_token_user_vault,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([dev_wallet]).rpc();

    const matchs_after = await program.account.playMatch.all();
    const match_after = matchs_after[1];
    assert(match_after.account.unlockTime.sub(expected_unlock_time).abs().lte(new anchor.BN(1))); // |unlock_time - expected_unlock_time| <= 1

    const fee = match.account.ticketTokenAmount.mul(new anchor.BN(config_data.feeRate)).div(new anchor.BN(10000));
    const return_amount = match.account.ticketTokenAmount.sub(fee);

    const ticket_balancefrom_after = (await connection.getTokenAccountBalance(ticket_token_vault)).value.amount;
    const ticket_balanceto_after = (await connection.getTokenAccountBalance(ticket_token_user_vault)).value.amount;
    const locked_balancefrom_after = (await connection.getTokenAccountBalance(locked_token_vault)).value.amount;
    const reward_balancefrom_after = (await connection.getTokenAccountBalance(reward_token_vault)).value.amount;
    const locked_balanceto_after = (await connection.getTokenAccountBalance(locked_token_user_vault)).value.amount;

    assert(ticket_balancefrom_after == (new anchor.BN(ticket_balancefrom_before)).sub(match.account.ticketTokenAmount).toString());
    assert(ticket_balanceto_after == (new anchor.BN(ticket_balanceto_before)).add(return_amount).toString());
    assert(locked_balancefrom_after == locked_balancefrom_before);
    assert(reward_balancefrom_after == reward_balancefrom_before);
    assert(locked_balanceto_after == locked_balanceto_before);
  });

  it("Cannot fulfill 1 lost match again!", async () => {
    let isFailed = false;
    try {
      const matchs = await program.account.playMatch.all();
      const match = matchs[1];
      await program.methods
        .fulfill(true)
        .accounts({
          config: config.publicKey,
          pool: pool,
          operator: dev_wallet.publicKey,
          playmatch: match.publicKey,
          transferAuthority: transfer_authority,
          ticketTokenMint: ticket_token_mint,
          ticketTokenVault: ticket_token_vault,
          lockedTokenVault: locked_token_vault,
          rewardTokenVault: reward_token_vault,
          ticketTokenUserVault: ticket_token_user_vault,
          lockedTokenUserVault: locked_token_user_vault,
          rewardTokenUserVault: reward_token_user_vault,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([dev_wallet]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "Fulfilled");
    }

    assert(isFailed);
  });

  it("Other user cannot unlock!", async () => {
    let isFailed = false;
    try {
      const matchs = await program.account.playMatch.all();
      const match = matchs[0];
      await program.methods
        .unlock()
        .accounts({
          config: config.publicKey,
          pool: pool,
          transferAuthority: transfer_authority,
          operator: provider.wallet.publicKey,
          playmatch: match.publicKey,
          lockedTokenVault: locked_token_vault,
          lockedTokenUserVault: locked_token_user_vault,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "An address constraint was violated");
      assert(e.origin == "operator");
    }

    assert(isFailed);
  });

  it("Cannot unlock a won match!", async () => {
    let isFailed = false;
    try {
      const matchs = await program.account.playMatch.all();
      const match = matchs[0];
      await program.methods
        .unlock()
        .accounts({
          config: config.publicKey,
          pool: pool,
          transferAuthority: transfer_authority,
          operator: dev_wallet.publicKey,
          playmatch: match.publicKey,
          lockedTokenVault: locked_token_vault,
          lockedTokenUserVault: locked_token_user_vault,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([dev_wallet]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "CannotUnlock");
    }

    assert(isFailed);
  });

  it("Cannot unlock early!", async () => {
    let isFailed = false;
    try {
      const matchs = await program.account.playMatch.all();
      const match = matchs[1];
      await program.methods
        .unlock()
        .accounts({
          config: config.publicKey,
          pool: pool,
          transferAuthority: transfer_authority,
          operator: dev_wallet.publicKey,
          playmatch: match.publicKey,
          lockedTokenVault: locked_token_vault,
          lockedTokenUserVault: locked_token_user_vault,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([dev_wallet]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "TooEarly");
    }

    assert(isFailed);
  });

  it("Should unlock correctly!", async () => {
    await sleep(31 * 1000);

    const ticket_balancefrom_before = (await connection.getTokenAccountBalance(ticket_token_vault)).value.amount;
    const ticket_balanceto_before = (await connection.getTokenAccountBalance(ticket_token_user_vault)).value.amount;
    const locked_balancefrom_before = (await connection.getTokenAccountBalance(locked_token_vault)).value.amount;
    const reward_balancefrom_before = (await connection.getTokenAccountBalance(reward_token_vault)).value.amount;
    const locked_balanceto_before = (await connection.getTokenAccountBalance(locked_token_user_vault)).value.amount;

    const matchs = await program.account.playMatch.all();
    const match = matchs[1];
    await program.methods
      .unlock()
      .accounts({
        config: config.publicKey,
        pool: pool,
        transferAuthority: transfer_authority,
        operator: dev_wallet.publicKey,
        playmatch: match.publicKey,
        lockedTokenVault: locked_token_vault,
        lockedTokenUserVault: locked_token_user_vault,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([dev_wallet]).rpc();

    const matchs_after = await program.account.playMatch.all();
    const match_after = matchs_after[1];
    assert(match_after.account.isUnlocked);

    const ticket_balancefrom_after = (await connection.getTokenAccountBalance(ticket_token_vault)).value.amount;
    const ticket_balanceto_after = (await connection.getTokenAccountBalance(ticket_token_user_vault)).value.amount;
    const locked_balancefrom_after = (await connection.getTokenAccountBalance(locked_token_vault)).value.amount;
    const reward_balancefrom_after = (await connection.getTokenAccountBalance(reward_token_vault)).value.amount;
    const locked_balanceto_after = (await connection.getTokenAccountBalance(locked_token_user_vault)).value.amount;

    assert(ticket_balancefrom_after == ticket_balancefrom_before);
    assert(ticket_balanceto_after == ticket_balanceto_before);
    assert(locked_balancefrom_after == (new anchor.BN(locked_balancefrom_before)).sub(match.account.lockedTokenAmount).toString());
    assert(reward_balancefrom_after == reward_balancefrom_before);
    assert(locked_balanceto_after == (new anchor.BN(locked_balanceto_before)).add(match.account.lockedTokenAmount).toString());
  });

  it("Cannot unlock 1 match many times!", async () => {
    let isFailed = false;
    try {
      const matchs = await program.account.playMatch.all();
      const match = matchs[1];
      await program.methods
        .unlock()
        .accounts({
          config: config.publicKey,
          pool: pool,
          transferAuthority: transfer_authority,
          operator: dev_wallet.publicKey,
          playmatch: match.publicKey,
          lockedTokenVault: locked_token_vault,
          lockedTokenUserVault: locked_token_user_vault,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([dev_wallet]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "Unlocked");
    }

    assert(isFailed);
  });
});

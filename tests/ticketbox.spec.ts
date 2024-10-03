import * as anchor from "@coral-xyz/anchor";
import { Ticketbox } from "../target/types/ticketbox";
import { assert, expect } from "chai";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { createAssociatedTokenAccount, createMint, mintToDestination } from "./utils/token";
import { PublicKey } from "@solana/web3.js";

function tokens(amount: string | number, decimals: number = 0): anchor.BN {
  return new anchor.BN(parseFloat(amount.toString()) * (10 ** decimals));
}

describe("ticketbox", () => {
  // Configure the client to use the local cluster.
  let provider = anchor.AnchorProvider.env();
  let connection = provider.connection;
  anchor.setProvider(provider);
  console.log("User wallet:", provider.wallet.publicKey.toString());

  const program = anchor.workspace.Ticketbox as anchor.Program<Ticketbox>;
  const config = anchor.web3.Keypair.generate();
  const maker_wallet = anchor.web3.Keypair.generate();
  const maker2_wallet = anchor.web3.Keypair.generate();
  const dev_wallet = anchor.web3.Keypair.generate();
  const dev2_wallet = anchor.web3.Keypair.generate();
  console.log("Maker wallet:", maker_wallet.publicKey.toString());
  console.log("Maker2 wallet:", maker2_wallet.publicKey.toString());
  console.log("Dev wallet:", dev_wallet.publicKey.toString());
  console.log("Dev2 wallet:", dev2_wallet.publicKey.toString());

  const ticket_price = tokens("1000"); // 1 USDC
  console.log("ticket_price", ticket_price.toString());
  const maker_percent = 9980; // 99.8%
  const dev_percent = 20; // 0.2%
  let ticket_token_mint: PublicKey;
  let currency_mint: PublicKey;
  let ticket_token_user_vault: PublicKey;
  let ticket_token_user2_vault: PublicKey;
  let currency_user_vault: PublicKey;
  let transfer_authority;
  let ticket_token_vault;
  let maker_vault: PublicKey;
  let maker2_vault: PublicKey;
  let dev_vault: PublicKey;
  let dev2_vault: PublicKey;

  before(async () => {
    ticket_token_mint = await createMint(provider, provider.wallet.publicKey); // SOLO
    console.log("Created Ticket Token:", ticket_token_mint.toString());
    currency_mint = await createMint(provider, provider.wallet.publicKey, 6); // USDC
    console.log("Created Currency:", currency_mint.toString());

    // setup atas
    ticket_token_user_vault = await createAssociatedTokenAccount(provider, ticket_token_mint, provider.wallet.publicKey, provider.wallet.publicKey);
    console.log("ticket_token_user_vault", ticket_token_user_vault.toString());
    ticket_token_user2_vault = await createAssociatedTokenAccount(provider, ticket_token_mint, dev_wallet.publicKey, provider.wallet.publicKey);
    console.log("ticket_token_user2_vault", ticket_token_user2_vault.toString());
    currency_user_vault = await createAssociatedTokenAccount(provider, currency_mint, provider.wallet.publicKey, provider.wallet.publicKey);
    console.log("currency_user_vault", currency_user_vault.toString());
    maker_vault = await createAssociatedTokenAccount(provider, currency_mint, maker_wallet.publicKey, provider.wallet.publicKey);
    console.log("maker_vault", maker_vault.toString());
    maker2_vault = await createAssociatedTokenAccount(provider, currency_mint, maker2_wallet.publicKey, provider.wallet.publicKey);
    console.log("maker2_vault", maker2_vault.toString());
    dev_vault = await createAssociatedTokenAccount(provider, currency_mint, dev_wallet.publicKey, provider.wallet.publicKey);
    console.log("dev_vault", dev_vault.toString());
    dev2_vault = await createAssociatedTokenAccount(provider, currency_mint, dev2_wallet.publicKey, provider.wallet.publicKey);
    console.log("dev2_vault", dev2_vault.toString());

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

    // setup initial balance of tokens
    await mintToDestination(provider, ticket_token_mint, ticket_token_user_vault, tokens("1000000", 9)); // 1000000 SOLO
    await mintToDestination(provider, ticket_token_mint, ticket_token_user2_vault, tokens("1000000", 9)); // 1000000 SOLO
    await mintToDestination(provider, currency_mint, currency_user_vault, tokens("20000", 6)); // 20000 USDC
    console.log("Mint tokens sucessfully");
  });

  it("Config should be initialized successfully", async () => {
    await program.methods
      .initializeConfig(
        provider.wallet.publicKey,
        ticket_price,
        maker_percent,
        dev_percent,
      )
      .accounts({
        config: config.publicKey,
        transferAuthority: transfer_authority,
        ticketTokenMint: ticket_token_mint,
        ticketTokenVault: ticket_token_vault,
        currencyMint: currency_mint,
        makerVault: maker_vault,
        devVault: dev_vault,
        funder: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([config]).rpc();

    const config_data = await program.account.ticketboxConfig.fetch(config.publicKey);
    assert(config_data.authority.equals(provider.wallet.publicKey));
    assert(config_data.ticketTokenMint.equals(ticket_token_mint));
    assert(config_data.ticketTokenVault.equals(ticket_token_vault));
    assert(config_data.currencyMint.equals(currency_mint));
    assert(config_data.makerVault.equals(maker_vault));
    assert(config_data.devVault.equals(dev_vault));
    assert(config_data.ticketPrice.eq(ticket_price));
    assert(config_data.makerPercent == maker_percent);
    assert(config_data.devPercent == dev_percent);
  });

  it("Other user cannot update authority!", async () => {
    let isFailed = false;
    try {
      await program.methods
        .updateAuthority()
        .accounts({
          config: config.publicKey,
          authority: dev_wallet.publicKey,
          newAuthority: maker_wallet.publicKey,
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

    const config_data = await program.account.ticketboxConfig.fetch(config.publicKey);
    assert(config_data.authority.equals(dev_wallet.publicKey));
  });

  it("Other user cannot update ticket price!", async () => {
    let isFailed = false;
    let new_ticket_price = tokens("2000"); // 2 USDC
    try {
      await program.methods
        .updateTicketPrice(new_ticket_price)
        .accounts({
          config: config.publicKey,
          authority: maker_wallet.publicKey,
        })
        .signers([maker_wallet]).rpc();
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

  it("Ticket price should be updated correctly!", async () => {
    let new_ticket_price = tokens("2000"); // 1 SOLO = 2 USDC
    await program.methods
      .updateTicketPrice(new_ticket_price)
      .accounts({
        config: config.publicKey,
        authority: dev_wallet.publicKey,
      })
      .signers([dev_wallet]).rpc();

    const config_data = await program.account.ticketboxConfig.fetch(config.publicKey);
    assert(config_data.ticketPrice.eq(new_ticket_price));
  });

  it("Other user cannot update maker vault!", async () => {
    let isFailed = false;
    try {
      await program.methods
        .updateMakerVault()
        .accounts({
          config: config.publicKey,
          authority: maker_wallet.publicKey,
          makerVault: maker2_vault,
        })
        .signers([maker_wallet]).rpc();
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

  it("Maker vault should be updated correctly!", async () => {
    await program.methods
      .updateMakerVault()
      .accounts({
        config: config.publicKey,
        authority: dev_wallet.publicKey,
        makerVault: maker2_vault,
      })
      .signers([dev_wallet]).rpc();

    const config_data = await program.account.ticketboxConfig.fetch(config.publicKey);
    assert(config_data.makerVault.equals(maker2_vault));
  });

  it("Other user cannot update dev vault!", async () => {
    let isFailed = false;
    try {
      await program.methods
        .updateDevVault()
        .accounts({
          config: config.publicKey,
          authority: maker_wallet.publicKey,
          devVault: dev2_vault,
        })
        .signers([maker_wallet]).rpc();
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

  it("Dev vault should be updated correctly!", async () => {
    await program.methods
      .updateDevVault()
      .accounts({
        config: config.publicKey,
        authority: dev_wallet.publicKey,
        devVault: dev2_vault,
      })
      .signers([dev_wallet]).rpc();

    const config_data = await program.account.ticketboxConfig.fetch(config.publicKey);
    assert(config_data.devVault.equals(dev2_vault));
  });

  it("Other user cannot update percents!", async () => {
    let isFailed = false;
    let new_maker_percent = 9000; // 90%
    let new_dev_percent = 1000; // 10%
    try {
      await program.methods
        .updatePercents(new_maker_percent, new_dev_percent)
        .accounts({
          config: config.publicKey,
          authority: maker_wallet.publicKey,
        })
        .signers([maker_wallet]).rpc();
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

  it("Sum of new percents should be 10000!", async () => {
    let isFailed = false;
    let new_maker_percent = 8000; // 80%
    let new_dev_percent = 1000; // 10%
    try {
      await program.methods
        .updatePercents(new_maker_percent, new_dev_percent)
        .accounts({
          config: config.publicKey,
          authority: dev_wallet.publicKey,
        })
        .signers([dev_wallet]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      assert((_err as anchor.AnchorError).error.errorMessage == "BadPercents");
    }

    assert(isFailed);
  });

  it("Percents should be updated correctly!", async () => {
    let new_maker_percent = 9000; // 90%
    let new_dev_percent = 1000; // 10%

    await program.methods
      .updatePercents(new_maker_percent, new_dev_percent)
      .accounts({
        config: config.publicKey,
        authority: dev_wallet.publicKey,
      })
      .signers([dev_wallet]).rpc();

    const config_data = await program.account.ticketboxConfig.fetch(config.publicKey);
    assert(config_data.makerPercent == new_maker_percent);
    assert(config_data.devPercent == new_dev_percent);
  });

  it("Ticket token should be deposited correctly!", async () => {
    const balancefrom_before = (await connection.getTokenAccountBalance(ticket_token_user2_vault)).value.amount;
    const balanceto_before = (await connection.getTokenAccountBalance(ticket_token_vault)).value.amount;
    const amount = tokens(10000, 9);
    await program.methods
      .depositTicketToken(amount)
      .accounts({
        config: config.publicKey,
        ticketTokenFromVault: ticket_token_user2_vault,
        ticketTokenVault: ticket_token_vault,
        funder: dev_wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([dev_wallet]).rpc();

    const balancefrom_after = (await connection.getTokenAccountBalance(ticket_token_user2_vault)).value.amount;
    const balanceto_after = (await connection.getTokenAccountBalance(ticket_token_vault)).value.amount;
    assert(balancefrom_after == (new anchor.BN(balancefrom_before)).sub(amount).toString());
    assert(balanceto_after == (new anchor.BN(balanceto_before)).add(amount).toString());
  });

  it("Other user cannot withdraw ticket tokens!", async () => {
    let isFailed = false;
    const amount = tokens("10000", 9);
    try {
      await program.methods
        .withdrawTicketToken(amount)
        .accounts({
          config: config.publicKey,
          authority: maker_wallet.publicKey,
          transferAuthority: transfer_authority,
          ticketTokenToVault: ticket_token_user_vault,
          ticketTokenVault: ticket_token_vault,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([maker_wallet]).rpc();
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

  it("Should check transferAuthority when withdrawing ticket tokens!", async () => {
    let isFailed = false;
    const amount = tokens("10000", 9);
    try {
      await program.methods
        .withdrawTicketToken(amount)
        .accounts({
          config: config.publicKey,
          authority: dev_wallet.publicKey,
          transferAuthority: ticket_token_vault,
          ticketTokenToVault: ticket_token_user_vault,
          ticketTokenVault: ticket_token_vault,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([dev_wallet]).rpc();
    }
    catch (_err) {
      isFailed = true;
      assert.isTrue(_err instanceof anchor.AnchorError);
      const e = (_err as anchor.AnchorError).error;
      assert(e.errorMessage == "A seeds constraint was violated");
      assert(e.origin == "transfer_authority");
    }

    assert(isFailed);
  });

  it("Cannot withdraw more than balance!", async () => {
    let isFailed = false;
    const amount = tokens("10001", 9);
    try {
      await program.methods
        .withdrawTicketToken(amount)
        .accounts({
          config: config.publicKey,
          authority: dev_wallet.publicKey,
          transferAuthority: transfer_authority,
          ticketTokenToVault: ticket_token_user_vault,
          ticketTokenVault: ticket_token_vault,
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

  it("Ticket token should be withdrawn correctly!", async () => {
    const balancefrom_before = (await connection.getTokenAccountBalance(ticket_token_vault)).value.amount;
    const balanceto_before = (await connection.getTokenAccountBalance(ticket_token_user_vault)).value.amount;
    const amount = tokens(1000, 9);
    await program.methods
      .withdrawTicketToken(amount)
      .accounts({
        config: config.publicKey,
        authority: dev_wallet.publicKey,
        transferAuthority: transfer_authority,
        ticketTokenToVault: ticket_token_user_vault,
        ticketTokenVault: ticket_token_vault,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([dev_wallet]).rpc();
    const balancefrom_after = (await connection.getTokenAccountBalance(ticket_token_vault)).value.amount;
    const balanceto_after = (await connection.getTokenAccountBalance(ticket_token_user_vault)).value.amount;
    assert(balancefrom_after == (new anchor.BN(balancefrom_before)).sub(amount).toString());
    assert(balanceto_after == (new anchor.BN(balanceto_before)).add(amount).toString());
  });

  it("Ticket token should be bought correctly!", async () => {
    const currency_balancefrom_before = (await connection.getTokenAccountBalance(currency_user_vault)).value.amount;
    const currency_balancemaker_before = (await connection.getTokenAccountBalance(maker2_vault)).value.amount;
    const currency_balancedev_before = (await connection.getTokenAccountBalance(dev2_vault)).value.amount;
    const ticket_balancefrom_before = (await connection.getTokenAccountBalance(ticket_token_vault)).value.amount;
    const ticket_balanceto_before = (await connection.getTokenAccountBalance(ticket_token_user_vault)).value.amount;

    const config_data = await program.account.ticketboxConfig.fetch(config.publicKey);
    const amount = tokens(1000, 9);
    const total_currency = amount.div(new anchor.BN(1000000)).mul(config_data.ticketPrice);
    const maker_amount = total_currency.div(new anchor.BN(10000)).mul(new anchor.BN(config_data.makerPercent));
    const dev_amount = total_currency.sub(maker_amount);
    await program.methods
      .buyTicket(amount)
      .accounts({
        config: config.publicKey,
        transferAuthority: transfer_authority,
        currencyUserVault: currency_user_vault,
        makerVault: maker2_vault,
        devVault: dev2_vault,
        ticketTokenVault: ticket_token_vault,
        ticketTokenUserVault: ticket_token_user_vault,
        funder: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([]).rpc();
    const currency_balancefrom_after = (await connection.getTokenAccountBalance(currency_user_vault)).value.amount;
    const currency_balancemaker_after = (await connection.getTokenAccountBalance(maker2_vault)).value.amount;
    const currency_balancedev_after = (await connection.getTokenAccountBalance(dev2_vault)).value.amount;
    const ticket_balancefrom_after = (await connection.getTokenAccountBalance(ticket_token_vault)).value.amount;
    const ticket_balanceto_after = (await connection.getTokenAccountBalance(ticket_token_user_vault)).value.amount;
    assert(currency_balancefrom_after == (new anchor.BN(currency_balancefrom_before)).sub(total_currency).toString());
    assert(currency_balancemaker_after == (new anchor.BN(currency_balancemaker_before)).add(maker_amount).toString());
    assert(currency_balancedev_after == (new anchor.BN(currency_balancedev_before)).add(dev_amount).toString());
    assert(ticket_balancefrom_after == (new anchor.BN(ticket_balancefrom_before)).sub(amount).toString());
    assert(ticket_balanceto_after == (new anchor.BN(ticket_balanceto_before)).add(amount).toString());
  });
});

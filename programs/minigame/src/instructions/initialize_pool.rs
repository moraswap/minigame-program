use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use game_config::GameConfig;
use pool::Pool;

#[derive(Accounts)]
pub struct InitializePool<'info> {
    pub config: Box<Account<'info, GameConfig>>,

    pub locked_token_mint: Account<'info, Mint>,
    pub reward_token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub pool: Box<Account<'info, Pool>>,

    /// CHECK: empty PDA, authority for token accounts
    #[account(seeds = [b"transfer_authority"], bump = config.transfer_authority_bump)]
    pub transfer_authority: AccountInfo<'info>,
    #[account(
        init,
        payer = authority,
        token::mint = locked_token_mint,
        token::authority = transfer_authority)]
    pub locked_token_vault: Box<Account<'info, TokenAccount>>,
    #[account(
        init,
        payer = authority,
        token::mint = reward_token_mint,
        token::authority = transfer_authority)]
    pub reward_token_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut, address = config.authority)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<InitializePool>,
    locked_token_amount: u64,
    reward_token_amount: u64,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    let locked_token_vault = ctx.accounts.locked_token_vault.key();
    let reward_token_vault = ctx.accounts.reward_token_vault.key();

    pool.initialize(
        ctx.accounts.config.key(),
        locked_token_vault,
        locked_token_amount,
        reward_token_vault,
        reward_token_amount,
    )?;

    emit!(InitializePoolEvent {
        header: PoolEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            pool: pool.key(),
        },
        locked_token_vault,
        locked_token_amount,
        reward_token_vault,
        reward_token_amount,
    });
    Ok(())
}

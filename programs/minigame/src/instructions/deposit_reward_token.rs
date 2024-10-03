use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use pool::Pool;

#[derive(Accounts)]
pub struct DepositRewardToken<'info> {
    pub pool: Account<'info, Pool>,

    #[account(mut, constraint = reward_token_vault.key() == pool.reward_token_vault)]
    pub reward_token_vault: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = reward_token_from_vault.mint == pool.reward_token_mint)]
    pub reward_token_from_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub funder: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<DepositRewardToken>, amount: u64) -> Result<()> {
    ctx.accounts.pool.transfer_tokens_from_user(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.reward_token_from_vault.to_account_info(),
        ctx.accounts.reward_token_vault.to_account_info(),
        ctx.accounts.funder.to_account_info(),
        amount,
    )?;

    emit!(DepositRewardTokenEvent {
        header: PoolEventHeader {
            signer: Some(ctx.accounts.funder.key()),
            pool: ctx.accounts.pool.key(),
        },
        funder: ctx.accounts.funder.key(),
        amount: amount,
    });
    Ok(())
}

use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use game_config::GameConfig;
use pool::Pool;

#[derive(Accounts)]
pub struct WithdrawRewardToken<'info> {
    pub config: Account<'info, GameConfig>,
    #[account(mut, has_one = config)]
    pub pool: Account<'info, Pool>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,

    #[account(mut, constraint = reward_token_vault.key() == pool.reward_token_vault)]
    pub reward_token_vault: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = reward_token_to_vault.mint == pool.reward_token_mint)]
    pub reward_token_to_vault: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<WithdrawRewardToken>, amount: u64) -> Result<()> {
    let authority_seeds = ctx.accounts.pool.seeds();
    ctx.accounts.pool.transfer_tokens(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.reward_token_vault.to_account_info(),
        ctx.accounts.reward_token_to_vault.to_account_info(),
        ctx.accounts.pool.to_account_info(),
        &[&authority_seeds],
        amount,
    )?;

    emit!(WithdrawRewardTokenEvent {
        header: PoolEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            pool: ctx.accounts.pool.key(),
        },
        reward_token_to_vault: ctx.accounts.reward_token_to_vault.key(),
        amount: amount,
    });
    Ok(())
}

use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use game_config::GameConfig;

#[derive(Accounts)]
pub struct DepositRewardToken<'info> {
    pub config: Account<'info, GameConfig>,

    #[account(mut, constraint = reward_token_vault.key() == config.reward_token_vault)]
    pub reward_token_vault: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = reward_token_from_vault.mint == config.reward_token_mint)]
    pub reward_token_from_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub funder: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<DepositRewardToken>, amount: u64) -> Result<()> {
    ctx.accounts.config.transfer_tokens_from_user(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.reward_token_from_vault.to_account_info(),
        ctx.accounts.reward_token_vault.to_account_info(),
        ctx.accounts.funder.to_account_info(),
        amount,
    )?;
    Ok(())
}

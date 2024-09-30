use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use game_config::GameConfig;

#[derive(Accounts)]
pub struct WithdrawRewardToken<'info> {
    pub config: Account<'info, GameConfig>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,

    /// CHECK: empty PDA, authority for token accounts
    #[account(seeds = [b"transfer_authority"], bump = config.transfer_authority_bump)]
    pub transfer_authority: AccountInfo<'info>,
    #[account(mut, constraint = reward_token_vault.key() == config.reward_token_vault)]
    pub reward_token_vault: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = reward_token_to_vault.mint == config.reward_token_mint)]
    pub reward_token_to_vault: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<WithdrawRewardToken>, amount: u64) -> Result<()> {
    ctx.accounts.config.transfer_tokens(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.reward_token_vault.to_account_info(),
        ctx.accounts.reward_token_to_vault.to_account_info(),
        ctx.accounts.transfer_authority.to_account_info(),
        amount,
    )?;
    Ok(())
}

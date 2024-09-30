use crate::state::*;
use anchor_lang::prelude::*;
use game_config::GameConfig;

#[derive(Accounts)]
pub struct UpdateLockedTokenAmount<'info> {
    #[account(mut)]
    pub config: Account<'info, GameConfig>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateLockedTokenAmount>, locked_token_amount: u64) -> Result<()> {
    ctx.accounts
        .config
        .update_locked_token_amount(locked_token_amount);
    Ok(())
}

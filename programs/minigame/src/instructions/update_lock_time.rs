use crate::state::*;
use anchor_lang::prelude::*;
use game_config::GameConfig;

#[derive(Accounts)]
pub struct UpdateLockTime<'info> {
    #[account(mut)]
    pub config: Account<'info, GameConfig>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateLockTime>, lock_time: u64) -> Result<()> {
    ctx.accounts
        .config
        .update_lock_time(lock_time);
    Ok(())
}

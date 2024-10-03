use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use game_config::GameConfig;

#[derive(Accounts)]
pub struct UpdateLockTime<'info> {
    #[account(mut)]
    pub config: Box<Account<'info, GameConfig>>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateLockTime>, lock_time: u64) -> Result<()> {
    let old_lock_time = ctx.accounts.config.lock_time;

    ctx.accounts.config.update_lock_time(lock_time);

    emit!(UpdateLockTimeEvent {
        header: ConfigEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            config: ctx.accounts.config.key(),
        },
        old_lock_time: old_lock_time,
        new_lock_time: lock_time,
    });
    Ok(())
}

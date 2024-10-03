use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use game_config::GameConfig;
use pool::Pool;

#[derive(Accounts)]
pub struct UpdateLockTime<'info> {
    pub config: Account<'info, GameConfig>,
    #[account(mut, has_one = config)]
    pub pool: Account<'info, Pool>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateLockTime>, lock_time: u64) -> Result<()> {
    let old_lock_time = ctx.accounts.pool.lock_time;

    ctx.accounts.pool.update_lock_time(lock_time);

    emit!(UpdateLockTimeEvent {
        header: PoolEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            pool: ctx.accounts.pool.key(),
        },
        old_lock_time: old_lock_time,
        new_lock_time: lock_time,
    });
    Ok(())
}

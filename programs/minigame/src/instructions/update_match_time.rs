use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use game_config::GameConfig;
use pool::Pool;

#[derive(Accounts)]
pub struct UpdateMatchTime<'info> {
    pub config: Account<'info, GameConfig>,
    #[account(mut, has_one = config)]
    pub pool: Account<'info, Pool>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateMatchTime>, match_time: u64) -> Result<()> {
    let old_match_time = ctx.accounts.pool.match_time;

    ctx.accounts.pool.update_match_time(match_time);

    emit!(UpdateMatchTimeEvent {
        header: PoolEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            pool: ctx.accounts.pool.key(),
        },
        old_match_time: old_match_time,
        new_match_time: match_time,
    });
    Ok(())
}

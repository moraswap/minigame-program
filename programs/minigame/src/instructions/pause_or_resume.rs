use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use game_config::GameConfig;
use pool::Pool;

#[derive(Accounts)]
pub struct PauseOrResume<'info> {
    pub config: Account<'info, GameConfig>,
    #[account(mut, has_one = config)]
    pub pool: Account<'info, Pool>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<PauseOrResume>) -> Result<()> {
    let is_pause = ctx.accounts.pool.is_pause;

    ctx.accounts.pool.pause_or_resume();

    if is_pause {
        emit!(ResumeEvent {
            header: PoolEventHeader {
                signer: Some(ctx.accounts.authority.key()),
                pool: ctx.accounts.pool.key(),
            },
        });
    } else {
        emit!(PauseEvent {
            header: PoolEventHeader {
                signer: Some(ctx.accounts.authority.key()),
                pool: ctx.accounts.pool.key(),
            },
        });
    }
    Ok(())
}

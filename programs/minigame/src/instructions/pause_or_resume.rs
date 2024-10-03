use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use game_config::GameConfig;

#[derive(Accounts)]
pub struct PauseOrResume<'info> {
    #[account(mut)]
    pub config: Box<Account<'info, GameConfig>>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<PauseOrResume>) -> Result<()> {
    let is_pause = ctx.accounts.config.is_pause;

    ctx.accounts.config.pause_or_resume();

    if is_pause {
        emit!(ResumeEvent {
            header: ConfigEventHeader {
                signer: Some(ctx.accounts.authority.key()),
                config: ctx.accounts.config.key(),
            },
        });
    } else {
        emit!(PauseEvent {
            header: ConfigEventHeader {
                signer: Some(ctx.accounts.authority.key()),
                config: ctx.accounts.config.key(),
            },
        });
    }
    Ok(())
}

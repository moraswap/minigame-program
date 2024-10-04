use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use game_config::GameConfig;

#[derive(Accounts)]
pub struct UpdateMatchTime<'info> {
    #[account(mut)]
    pub config: Account<'info, GameConfig>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateMatchTime>, match_time: u64) -> Result<()> {
    let old_match_time = ctx.accounts.config.match_time;
    ctx.accounts.config.update_match_time(match_time);

    emit!(UpdateMatchTimeEvent {
        header: ConfigEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            config: ctx.accounts.config.key(),
        },
        old_match_time: old_match_time,
        new_match_time: match_time,
    });
    Ok(())
}

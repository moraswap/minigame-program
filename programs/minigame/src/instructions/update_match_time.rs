use crate::state::*;
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
    ctx.accounts
        .config
        .update_match_time(match_time);
    Ok(())
}

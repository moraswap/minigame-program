use crate::state::*;
use anchor_lang::prelude::*;
use game_config::GameConfig;

#[derive(Accounts)]
pub struct UpdateFeeRate<'info> {
    #[account(mut)]
    pub config: Account<'info, GameConfig>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateFeeRate>, fee_rate: u16) -> Result<()> {
    ctx.accounts
        .config
        .update_fee_rate(fee_rate)?;
    Ok(())
}

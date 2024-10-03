use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use game_config::GameConfig;
use pool::Pool;

#[derive(Accounts)]
pub struct UpdateFeeRate<'info> {
    pub config: Account<'info, GameConfig>,
    #[account(mut, has_one = config)]
    pub pool: Account<'info, Pool>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateFeeRate>, fee_rate: u16) -> Result<()> {
    let old_fee_rate = ctx.accounts.pool.fee_rate;

    ctx.accounts.pool.update_fee_rate(fee_rate)?;

    emit!(UpdateFeeRateEvent {
        header: PoolEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            pool: ctx.accounts.pool.key(),
        },
        old_fee_rate: old_fee_rate,
        new_fee_rate: fee_rate,
    });
    Ok(())
}

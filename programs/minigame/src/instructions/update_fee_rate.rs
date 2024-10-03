use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use game_config::GameConfig;

#[derive(Accounts)]
pub struct UpdateFeeRate<'info> {
    #[account(mut)]
    pub config: Box<Account<'info, GameConfig>>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateFeeRate>, fee_rate: u16) -> Result<()> {
    let old_fee_rate = ctx.accounts.config.fee_rate;

    ctx.accounts.config.update_fee_rate(fee_rate)?;

    emit!(UpdateFeeRateEvent {
        header: ConfigEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            config: ctx.accounts.config.key(),
        },
        old_fee_rate: old_fee_rate,
        new_fee_rate: fee_rate,
    });
    Ok(())
}

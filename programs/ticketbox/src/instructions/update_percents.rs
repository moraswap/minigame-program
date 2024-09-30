use crate::state::*;
use anchor_lang::prelude::*;
use ticketbox_config::TicketboxConfig;

#[derive(Accounts)]
pub struct UpdatePercents<'info> {
    #[account(mut)]
    pub config: Account<'info, TicketboxConfig>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdatePercents>, maker_percent: u16, dev_percent: u16) -> Result<()> {
    ctx.accounts
        .config
        .update_percents(maker_percent, dev_percent)?;
    Ok(())
}

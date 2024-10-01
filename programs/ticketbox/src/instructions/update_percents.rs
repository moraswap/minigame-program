use crate::{events::*, state::*};
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
    let old_maker_percent = ctx.accounts.config.maker_percent;
    let old_dev_percent = ctx.accounts.config.dev_percent;
    ctx.accounts
        .config
        .update_percents(maker_percent, dev_percent)?;

    emit!(UpdatePercentsEvent {
        header: EventHeader {
            signer: Some(ctx.accounts.authority.key()),
            config: ctx.accounts.config.key(),
        },
        old_maker_percent: old_maker_percent,
        old_dev_percent: old_dev_percent,
        new_maker_percent: maker_percent,
        new_dev_percent: dev_percent,
    });
    Ok(())
}

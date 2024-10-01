use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use ticketbox_config::TicketboxConfig;

#[derive(Accounts)]
pub struct UpdateTicketPrice<'info> {
    #[account(mut)]
    pub config: Account<'info, TicketboxConfig>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateTicketPrice>, ticket_price: u64) -> Result<()> {
    let old_ticket_price = ctx.accounts.config.ticket_price;

    ctx.accounts.config.update_ticket_price(ticket_price)?;

    emit!(UpdateTicketPriceEvent {
        header: EventHeader {
            signer: Some(ctx.accounts.authority.key()),
            config: ctx.accounts.config.key(),
        },
        old_ticket_price: old_ticket_price,
        new_ticket_price: ticket_price,
    });
    Ok(())
}

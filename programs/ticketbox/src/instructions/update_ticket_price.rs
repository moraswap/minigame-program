use crate::state::*;
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
    ctx.accounts
        .config
        .update_ticket_price(ticket_price)?;
    Ok(())
}

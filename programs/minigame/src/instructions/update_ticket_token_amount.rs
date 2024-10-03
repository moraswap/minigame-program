use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use game_config::GameConfig;

#[derive(Accounts)]
pub struct UpdateTicketTokenAmount<'info> {
    #[account(mut)]
    pub config: Box<Account<'info, GameConfig>>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateTicketTokenAmount>, ticket_token_amount: u64) -> Result<()> {
    let old_ticket_token_amount = ctx.accounts.config.ticket_token_amount;
    ctx.accounts
        .config
        .update_ticket_token_amount(ticket_token_amount);

    emit!(UpdateTicketTokenAmountEvent {
        header: ConfigEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            config: ctx.accounts.config.key(),
        },
        old_ticket_token_amount: old_ticket_token_amount,
        new_ticket_token_amount: ticket_token_amount,
    });
    Ok(())
}

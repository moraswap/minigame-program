use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use game_config::GameConfig;
use pool::Pool;

#[derive(Accounts)]
pub struct UpdateTicketTokenAmount<'info> {
    pub config: Account<'info, GameConfig>,
    #[account(mut, has_one = config)]
    pub pool: Account<'info, Pool>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateTicketTokenAmount>, ticket_token_amount: u64) -> Result<()> {
    let old_ticket_token_amount = ctx.accounts.pool.ticket_token_amount;
    ctx.accounts
        .pool
        .update_ticket_token_amount(ticket_token_amount);

    emit!(UpdateTicketTokenAmountEvent {
        header: PoolEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            pool: ctx.accounts.pool.key(),
        },
        old_ticket_token_amount: old_ticket_token_amount,
        new_ticket_token_amount: ticket_token_amount,
    });
    Ok(())
}

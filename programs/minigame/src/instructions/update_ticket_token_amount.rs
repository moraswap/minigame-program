use crate::state::*;
use anchor_lang::prelude::*;
use game_config::GameConfig;

#[derive(Accounts)]
pub struct UpdateTicketTokenAmount<'info> {
    #[account(mut)]
    pub config: Account<'info, GameConfig>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateTicketTokenAmount>, ticket_token_amount: u64) -> Result<()> {
    ctx.accounts
        .config
        .update_ticket_token_amount(ticket_token_amount);
    Ok(())
}

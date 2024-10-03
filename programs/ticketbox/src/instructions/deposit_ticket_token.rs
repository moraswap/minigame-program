use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use ticketbox_config::TicketboxConfig;

#[derive(Accounts)]
pub struct DepositTicketToken<'info> {
    pub config: Box<Account<'info, TicketboxConfig>>,

    #[account(mut, constraint = ticket_token_vault.key() == config.ticket_token_vault)]
    pub ticket_token_vault: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = ticket_token_from_vault.mint == config.ticket_token_mint)]
    pub ticket_token_from_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub funder: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<DepositTicketToken>, amount: u64) -> Result<()> {
    ctx.accounts.config.transfer_tokens_from_user(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.ticket_token_from_vault.to_account_info(),
        ctx.accounts.ticket_token_vault.to_account_info(),
        ctx.accounts.funder.to_account_info(),
        amount,
    )?;

    emit!(DepositTicketTokenEvent {
        header: EventHeader {
            signer: Some(ctx.accounts.funder.key()),
            config: ctx.accounts.config.key(),
        },
        funder: ctx.accounts.funder.key(),
        amount: amount,
    });
    Ok(())
}

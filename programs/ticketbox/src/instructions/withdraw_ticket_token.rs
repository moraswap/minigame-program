use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use ticketbox_config::TicketboxConfig;

#[derive(Accounts)]
pub struct WithdrawTicketToken<'info> {
    pub config: Account<'info, TicketboxConfig>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,

    /// CHECK: empty PDA, authority for token accounts
    #[account(seeds = [b"transfer_authority"], bump = config.transfer_authority_bump)]
    pub transfer_authority: AccountInfo<'info>,
    #[account(mut, constraint = ticket_token_vault.key() == config.ticket_token_vault)]
    pub ticket_token_vault: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = ticket_token_to_vault.mint == config.ticket_token_mint)]
    pub ticket_token_to_vault: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<WithdrawTicketToken>, amount: u64) -> Result<()> {
    ctx.accounts.config.transfer_tokens(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.ticket_token_vault.to_account_info(),
        ctx.accounts.ticket_token_to_vault.to_account_info(),
        ctx.accounts.transfer_authority.to_account_info(),
        amount,
    )?;

    emit!(WithdrawTicketTokenEvent {
        header: EventHeader {
            signer: Some(ctx.accounts.authority.key()),
            config: ctx.accounts.config.key(),
        },
        ticket_token_to_vault: ctx.accounts.ticket_token_to_vault.key(),
        amount: amount,
    });
    Ok(())
}

use crate::{events::*, math::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use ticketbox_config::TicketboxConfig;

#[derive(Accounts)]
pub struct BuyTicket<'info> {
    pub config: Account<'info, TicketboxConfig>,

    /// CHECK: empty PDA, authority for token accounts
    #[account(seeds = [b"transfer_authority"], bump = config.transfer_authority_bump)]
    pub transfer_authority: AccountInfo<'info>,

    #[account(mut, constraint = ticket_token_user_vault.mint == config.ticket_token_mint)]
    pub ticket_token_user_vault: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = currency_user_vault.mint == config.currency_mint)]
    pub currency_user_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = ticket_token_vault.key() == config.ticket_token_vault)]
    pub ticket_token_vault: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = currency_vault.key() == config.currency_vault)]
    pub currency_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub funder: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<BuyTicket>, amount: u64) -> Result<u64> {
    let config = &mut ctx.accounts.config;

    let total_currency = safe_mul(safe_div(amount, 1000000)?, config.ticket_price)?;
    if total_currency > 0 {
        msg!("Transfer currency from user");
        ctx.accounts.config.transfer_tokens_from_user(
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.currency_user_vault.to_account_info(),
            ctx.accounts.currency_vault.to_account_info(),
            ctx.accounts.funder.to_account_info(),
            total_currency,
        )?;
    }
    if amount > 0 {
        msg!("Transfer tickets to user");
        ctx.accounts.config.transfer_tokens(
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.ticket_token_vault.to_account_info(),
            ctx.accounts.ticket_token_user_vault.to_account_info(),
            ctx.accounts.transfer_authority.to_account_info(),
            amount,
        )?;
    }

    emit!(BuyTicketEvent {
        header: EventHeader {
            signer: Some(ctx.accounts.funder.key()),
            config: ctx.accounts.config.key(),
        },
        funder: ctx.accounts.funder.key(),
        ticket_token_user_vault: ctx.accounts.ticket_token_user_vault.key(),
        ticket_amount: amount,
        total_currency: total_currency,
    });
    Ok(total_currency)
}

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
    #[account(mut, constraint = maker_vault.key() == config.maker_vault)]
    pub maker_vault: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = dev_vault.key() == config.dev_vault)]
    pub dev_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub funder: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<BuyTicket>, amount: u64) -> Result<u64> {
    let config = &mut ctx.accounts.config;

    let total_currency = safe_mul(safe_div(amount, 1000000)?, config.ticket_price)?;
    let maker_amount = safe_mul(
        safe_div(total_currency, 10000)?,
        config.maker_percent as u64,
    )?;
    let dev_amount = safe_sub(total_currency, maker_amount)?;
    if maker_amount > 0 {
        msg!("Transfer currency from user to maker vault");
        ctx.accounts.config.transfer_tokens_from_user(
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.currency_user_vault.to_account_info(),
            ctx.accounts.maker_vault.to_account_info(),
            ctx.accounts.funder.to_account_info(),
            maker_amount,
        )?;
    }
    if dev_amount > 0 {
        msg!("Transfer currency from user to dev vault");
        ctx.accounts.config.transfer_tokens_from_user(
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.currency_user_vault.to_account_info(),
            ctx.accounts.dev_vault.to_account_info(),
            ctx.accounts.funder.to_account_info(),
            dev_amount,
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

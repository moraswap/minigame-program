use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use ticketbox_config::TicketboxConfig;

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(init, payer = funder, space = TicketboxConfig::LEN)]
    pub config: Box<Account<'info, TicketboxConfig>>,

    /// CHECK: empty PDA, will be set as authority for token accounts
    #[account(
        init,
        payer = funder,
        space = 0,
        seeds = [b"transfer_authority"],
        bump,
    )]
    pub transfer_authority: AccountInfo<'info>,

    pub ticket_token_mint: Account<'info, Mint>,
    pub currency_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = funder,
        seeds=[b"ticket", config.key().as_ref()], 
        bump, 
        token::mint = ticket_token_mint,
        token::authority = transfer_authority)]
    pub ticket_token_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = maker_vault.mint == currency_mint.key())]
    pub maker_vault: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = dev_vault.mint == currency_mint.key())]
    pub dev_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub funder: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<InitializeConfig>,
    authority: Pubkey,
    ticket_price: u64,
    maker_percent: u16,
    dev_percent: u16,
) -> Result<()> {
    let config = &mut ctx.accounts.config;
    let ticket_token_mint = ctx.accounts.ticket_token_mint.key();
    let currency_mint = ctx.accounts.currency_mint.key();

    let ticket_token_vault = ctx.accounts.ticket_token_vault.key();
    let maker_vault = ctx.accounts.maker_vault.key();
    let dev_vault = ctx.accounts.dev_vault.key();

    let transfer_authority_bump = ctx.bumps.transfer_authority;

    config.initialize(
        authority,
        ticket_token_mint,
        ticket_token_vault,
        currency_mint,
        ticket_price,
        maker_vault,
        maker_percent,
        dev_vault,
        dev_percent,
        transfer_authority_bump,
    )?;

    emit!(InitializeConfigEvent {
        header: EventHeader {
            signer: Some(ctx.accounts.funder.key()),
            config: config.key(),
        },
        authority: authority,
        ticket_token_mint: ticket_token_mint,
        ticket_token_vault: ticket_token_vault,
        currency_mint: currency_mint,
        ticket_price: ticket_price,
        maker_vault: maker_vault,
        maker_percent: maker_percent,
        dev_vault: dev_vault,
        dev_percent: dev_percent,
    });
    Ok(())
}

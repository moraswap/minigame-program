use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use game_config::GameConfig;

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(init, payer = funder, space = GameConfig::LEN)]
    pub config: Account<'info, GameConfig>,

    /// CHECK: empty PDA, will be set as authority for token accounts
    #[account(
        init,
        payer = funder,
        space = 0,
        seeds = [b"transfer_authority"],
        bump
    )]
    pub transfer_authority: AccountInfo<'info>,

    pub ticket_token_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = funder,
        seeds=[b"ticket", config.key().as_ref()], 
        bump,
        token::mint = ticket_token_mint,
        token::authority = transfer_authority)]
    pub ticket_token_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub funder: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<InitializeConfig>,
    authority: Pubkey,
    operator: Pubkey,
) -> Result<()> {
    let config = &mut ctx.accounts.config;
    let ticket_token_mint = ctx.accounts.ticket_token_mint.key();
    let ticket_token_vault = ctx.accounts.ticket_token_vault.key();
    let transfer_authority_bump = ctx.bumps.transfer_authority;

    config.initialize(
        authority,
        operator,
        ticket_token_mint,
        ticket_token_vault,
        transfer_authority_bump,
    )?;

    emit!(InitializeConfigEvent {
        header: ConfigEventHeader {
            signer: Some(ctx.accounts.funder.key()),
            config: ctx.accounts.config.key(),
        },
        authority: authority,
        operator: operator,
        ticket_token_mint: ticket_token_mint,
        ticket_token_vault: ticket_token_vault,
    });
    Ok(())
}

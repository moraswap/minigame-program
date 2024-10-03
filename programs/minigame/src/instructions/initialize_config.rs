use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use game_config::GameConfig;

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(init, payer = funder, space = GameConfig::LEN)]
    pub config: Box<Account<'info, GameConfig>>,

    /// CHECK: empty PDA, will be set as authority for token accounts
    #[account(
        init,
        payer = funder,
        space = 0,
        seeds = [b"transfer_authority"],
        bump
    )]
    pub transfer_authority: AccountInfo<'info>,

    pub ticket_token_mint: Box<Account<'info, Mint>>,
    pub locked_token_mint: Box<Account<'info, Mint>>,
    pub reward_token_mint: Box<Account<'info, Mint>>,

    #[account(
        init,
        payer = funder,
        seeds=[b"ticket", config.key().as_ref()], 
        bump,
        token::mint = ticket_token_mint,
        token::authority = transfer_authority)]
    pub ticket_token_vault: Box<Account<'info, TokenAccount>>,
    #[account(
        init,
        payer = funder,
        seeds=[b"locked", config.key().as_ref()], 
        bump,
        token::mint = locked_token_mint,
        token::authority = transfer_authority)]
    pub locked_token_vault: Box<Account<'info, TokenAccount>>,
    #[account(
        init,
        payer = funder,
        seeds=[b"reward", config.key().as_ref()], 
        bump,
        token::mint = reward_token_mint,
        token::authority = transfer_authority)]
    pub reward_token_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub funder: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<InitializeConfig>,
    authority: Pubkey,
    operator: Pubkey,
    ticket_token_amount: u64,
    fee_rate: u16,
    locked_token_amount: u64,
    lock_time: u64,
    reward_token_amount: u64,
    match_time: u64,
) -> Result<()> {
    let config = &mut ctx.accounts.config;
    let ticket_token_mint = ctx.accounts.ticket_token_mint.key();
    let locked_token_mint = ctx.accounts.locked_token_mint.key();
    let reward_token_mint = ctx.accounts.reward_token_mint.key();

    let ticket_token_vault = ctx.accounts.ticket_token_vault.key();
    let locked_token_vault = ctx.accounts.locked_token_vault.key();
    let reward_token_vault = ctx.accounts.reward_token_vault.key();

    let transfer_authority_bump = ctx.bumps.transfer_authority;

    config.initialize(
        authority,
        operator,
        ticket_token_mint,
        ticket_token_vault,
        ticket_token_amount,
        fee_rate,
        locked_token_mint,
        locked_token_vault,
        locked_token_amount,
        lock_time,
        reward_token_mint,
        reward_token_vault,
        reward_token_amount,
        match_time,
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
        ticket_token_amount: ticket_token_amount,
        fee_rate: fee_rate,
        locked_token_mint: locked_token_mint,
        locked_token_vault: locked_token_vault,
        locked_token_amount: locked_token_amount,
        lock_time: lock_time,
        reward_token_mint: reward_token_mint,
        reward_token_vault: reward_token_vault,
        reward_token_amount: reward_token_amount,
        match_time: match_time,
    });
    Ok(())
}

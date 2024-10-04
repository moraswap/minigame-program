use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use game_config::GameConfig;
use play_match::PlayMatch;
use pool::Pool;

#[derive(Accounts)]
pub struct Play<'info> {
    pub config: Account<'info, GameConfig>,
    #[account(has_one = config)]
    pub pool: Box<Account<'info, Pool>>,

    #[account(
        init,
        payer = funder,
        space = PlayMatch::LEN,
        seeds = [b"match".as_ref(), match_mint.key().as_ref()],
        bump,
    )]
    pub playmatch: Box<Account<'info, PlayMatch>>,

    #[account(init,
        payer = funder,
        mint::authority = pool,
        mint::decimals = 0,
    )]
    pub match_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        constraint = ticket_token_user_vault.mint == config.ticket_token_mint,
        constraint = ticket_token_user_vault.owner == funder.key()
    )]
    pub ticket_token_user_vault: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        constraint = locked_token_user_vault.mint == pool.locked_token_mint,
        constraint = locked_token_user_vault.owner == funder.key()
    )]
    pub locked_token_user_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = ticket_token_vault.key() == config.ticket_token_vault)]
    pub ticket_token_vault: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = locked_token_vault.key() == pool.locked_token_vault)]
    pub locked_token_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub funder: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<Play>) -> Result<()> {
    let config = &ctx.accounts.config;
    let user = ctx.accounts.funder.key();

    // receive ticket tokens
    if ctx.accounts.config.ticket_token_amount > 0 {
        msg!("Transfer ticket tokens from user");
        config.transfer_tokens_from_user(
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.ticket_token_user_vault.to_account_info(),
            ctx.accounts.ticket_token_vault.to_account_info(),
            ctx.accounts.funder.to_account_info(),
            ctx.accounts.config.ticket_token_amount,
        )?;
    }

    // receive locked tokens
    if ctx.accounts.pool.locked_token_amount > 0 {
        msg!("Transfer locked tokens from user");
        config.transfer_tokens_from_user(
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.locked_token_user_vault.to_account_info(),
            ctx.accounts.locked_token_vault.to_account_info(),
            ctx.accounts.funder.to_account_info(),
            ctx.accounts.pool.locked_token_amount,
        )?;
    }

    ctx.accounts.playmatch.initialize(
        config,
        &ctx.accounts.pool,
        ctx.accounts.match_mint.key(),
        user,
    )?;

    emit!(PlayEvent {
        header: MatchEventHeader {
            signer: Some(ctx.accounts.funder.key()),
            config: config.key(),
            pool: ctx.accounts.pool.key(),
            playmatch: ctx.accounts.playmatch.key(),
        },
        funder: ctx.accounts.funder.key(),
        match_mint: ctx.accounts.match_mint.key(),
        ticket_token_amount: ctx.accounts.config.ticket_token_amount,
        locked_token_amount: ctx.accounts.pool.locked_token_amount,
        reward_token_amount: ctx.accounts.pool.reward_token_amount,
    });
    Ok(())
}

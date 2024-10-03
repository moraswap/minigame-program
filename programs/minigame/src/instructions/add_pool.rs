use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use game_config::GameConfig;
use pool::Pool;

#[derive(Accounts)]
pub struct AddPool<'info> {
    #[account(mut)]
    pub config: Account<'info, GameConfig>,

    pub locked_token_mint: Account<'info, Mint>,
    pub reward_token_mint: Account<'info, Mint>,

    #[account(init,
        seeds = [
          b"pool".as_ref(),
          config.key().as_ref(),
          locked_token_mint.key().as_ref(),
          reward_token_mint.key().as_ref(),
        ],
        bump,
        payer = authority,
        space = Pool::LEN)]
    pub pool: Box<Account<'info, Pool>>,

    #[account(
        init,
        payer = authority,
        token::token_program = locked_token_program,
        token::mint = locked_token_mint,
        token::authority = pool)]
    pub locked_token_vault: Box<Account<'info, TokenAccount>>,
    #[account(
        init,
        payer = authority,
        token::token_program = reward_token_program,
        token::mint = reward_token_mint,
        token::authority = pool)]
    pub reward_token_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut, address = config.authority)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    #[account(address = *locked_token_vault.to_account_info().owner)]
    pub locked_token_program: Program<'info, Token>,
    #[account(address = *reward_token_vault.to_account_info().owner)]
    pub reward_token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<AddPool>,
    ticket_token_amount: u64,
    fee_rate: u16,
    locked_token_amount: u64,
    lock_time: u64,
    reward_token_amount: u64,
    match_time: u64,
) -> Result<()> {
    let config = &mut ctx.accounts.config;
    let pool = &mut ctx.accounts.pool;
    let locked_token_mint = ctx.accounts.locked_token_mint.key();
    let reward_token_mint = ctx.accounts.reward_token_mint.key();
    let locked_token_vault = ctx.accounts.locked_token_vault.key();
    let reward_token_vault = ctx.accounts.reward_token_vault.key();
    let bump = ctx.bumps.pool;

    pool.initialize(
        config.key(),
        bump,
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
    )?;

    emit!(AddPoolEvent {
        header: PoolEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            pool: pool.key(),
        },
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

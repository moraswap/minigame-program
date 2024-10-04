use crate::{errors::ErrorCode, events::*, math::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use game_config::GameConfig;
use play_match::PlayMatch;
use pool::Pool;

#[derive(Accounts)]
pub struct Fulfill<'info> {
    pub config: Account<'info, GameConfig>,
    #[account(has_one = config)]
    pub pool: Account<'info, Pool>,

    #[account(address = config.operator)]
    pub operator: Signer<'info>,

    #[account(mut)]
    pub playmatch: Box<Account<'info, PlayMatch>>,

    /// CHECK: empty PDA, authority for token accounts
    #[account(seeds = [b"transfer_authority"], bump = config.transfer_authority_bump)]
    pub transfer_authority: AccountInfo<'info>,

    #[account(mut, constraint = ticket_token_mint.key() == config.ticket_token_mint)]
    pub ticket_token_mint: Account<'info, Mint>,

    #[account(mut, constraint = ticket_token_vault.key() == config.ticket_token_vault)]
    pub ticket_token_vault: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = locked_token_vault.key() == pool.locked_token_vault)]
    pub locked_token_vault: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = reward_token_vault.key() == pool.reward_token_vault)]
    pub reward_token_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        constraint = ticket_token_user_vault.mint == config.ticket_token_mint,
        constraint = ticket_token_user_vault.owner == playmatch.user
    )]
    pub ticket_token_user_vault: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        constraint = locked_token_user_vault.mint == pool.locked_token_mint,
        constraint = locked_token_user_vault.owner == playmatch.user
    )]
    pub locked_token_user_vault: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        constraint = reward_token_user_vault.mint == pool.reward_token_mint,
        constraint = reward_token_user_vault.owner == playmatch.user
    )]
    pub reward_token_user_vault: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<Fulfill>, is_win: bool) -> Result<()> {
    let config = &ctx.accounts.config;
    let playmatch = &mut ctx.accounts.playmatch;

    if playmatch.is_fulfilled {
        return Err(ErrorCode::Fulfilled.into());
    }

    playmatch.fulfill(config, is_win)?;
    if is_win {
        if playmatch.locked_token_amount > 0 {
            msg!("Transfer locked tokens to user");
            config.transfer_tokens(
                ctx.accounts.token_program.to_account_info(),
                ctx.accounts.locked_token_vault.to_account_info(),
                ctx.accounts.locked_token_user_vault.to_account_info(),
                ctx.accounts.transfer_authority.to_account_info(),
                playmatch.locked_token_amount,
            )?;
        }

        if playmatch.reward_token_amount > 0 {
            msg!("Transfer reward tokens to user");
            config.transfer_tokens(
                ctx.accounts.token_program.to_account_info(),
                ctx.accounts.reward_token_vault.to_account_info(),
                ctx.accounts.reward_token_user_vault.to_account_info(),
                ctx.accounts.transfer_authority.to_account_info(),
                playmatch.reward_token_amount,
            )?;
        }

        if playmatch.ticket_token_amount > 0 {
            msg!("Burn ticket tokens");
            config.burn_tokens(
                ctx.accounts.token_program.to_account_info(),
                ctx.accounts.ticket_token_mint.to_account_info(),
                ctx.accounts.ticket_token_vault.to_account_info(),
                ctx.accounts.transfer_authority.to_account_info(),
                playmatch.ticket_token_amount,
            )?;
        }
    } else {
        let fee = safe_div(
            safe_mul(playmatch.ticket_token_amount, config.fee_rate as u64)?,
            10000,
        )?;
        let return_amount = safe_sub(playmatch.ticket_token_amount, fee)?;

        if return_amount > 0 {
            msg!("Transfer return_amount of ticket tokens to user");
            config.transfer_tokens(
                ctx.accounts.token_program.to_account_info(),
                ctx.accounts.ticket_token_vault.to_account_info(),
                ctx.accounts.ticket_token_user_vault.to_account_info(),
                ctx.accounts.transfer_authority.to_account_info(),
                return_amount,
            )?;
        }

        if fee > 0 {
            msg!("Burn fee");
            config.burn_tokens(
                ctx.accounts.token_program.to_account_info(),
                ctx.accounts.ticket_token_mint.to_account_info(),
                ctx.accounts.ticket_token_vault.to_account_info(),
                ctx.accounts.transfer_authority.to_account_info(),
                fee,
            )?;
        }
    }

    emit!(FulfillEvent {
        header: MatchEventHeader {
            signer: Some(ctx.accounts.operator.key()),
            config: config.key(),
            pool: ctx.accounts.pool.key(),
            playmatch: ctx.accounts.playmatch.key(),
        },
        is_win: is_win,
    });
    Ok(())
}

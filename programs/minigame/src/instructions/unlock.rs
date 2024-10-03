use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use game_config::GameConfig;
use play_match::PlayMatch;
use pool::Pool;

#[derive(Accounts)]
pub struct Unlock<'info> {
    pub config: Account<'info, GameConfig>,
    #[account(mut, has_one = config)]
    pub pool: Account<'info, Pool>,

    #[account(address = config.operator)]
    pub operator: Signer<'info>,

    #[account(mut, constraint = playmatch.pool == pool.key())]
    pub playmatch: Box<Account<'info, PlayMatch>>,

    #[account(mut, constraint = locked_token_vault.key() == pool.locked_token_vault)]
    pub locked_token_vault: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        constraint = locked_token_user_vault.mint == pool.locked_token_mint,
        constraint = locked_token_user_vault.owner == playmatch.user,
    )]
    pub locked_token_user_vault: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<Unlock>) -> Result<()> {
    let playmatch = &mut ctx.accounts.playmatch;

    playmatch.unlock()?;

    if playmatch.locked_token_amount > 0 {
        msg!("Transfer locked tokens to user");
        let authority_seeds = ctx.accounts.pool.seeds();
        ctx.accounts.pool.transfer_tokens(
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.locked_token_vault.to_account_info(),
            ctx.accounts.locked_token_user_vault.to_account_info(),
            ctx.accounts.pool.to_account_info(),
            &[&authority_seeds],
            playmatch.locked_token_amount,
        )?;
    }

    emit!(UnlockEvent {
        header: MatchEventHeader {
            signer: Some(ctx.accounts.operator.key()),
            config: ctx.accounts.config.key(),
            pool: ctx.accounts.pool.key(),
            playmatch: ctx.accounts.playmatch.key(),
        },
    });
    Ok(())
}

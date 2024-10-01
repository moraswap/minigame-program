use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use game_config::GameConfig;
use play_match::PlayMatch;

#[derive(Accounts)]
pub struct Unlock<'info> {
    #[account(mut)]
    pub config: Account<'info, GameConfig>,

    #[account(address = config.operator)]
    pub operator: Signer<'info>,

    #[account(mut)]
    pub playmatch: Box<Account<'info, PlayMatch>>,

    /// CHECK: empty PDA, authority for token accounts
    #[account(seeds = [b"transfer_authority"], bump = config.transfer_authority_bump)]
    pub transfer_authority: AccountInfo<'info>,
    #[account(mut, constraint = locked_token_vault.key() == config.locked_token_vault)]
    pub locked_token_vault: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        constraint = locked_token_user_vault.mint == config.locked_token_mint,
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
        ctx.accounts.config.transfer_tokens(
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.locked_token_vault.to_account_info(),
            ctx.accounts.locked_token_user_vault.to_account_info(),
            ctx.accounts.transfer_authority.to_account_info(),
            playmatch.locked_token_amount,
        )?;
    }

    emit!(UnlockEvent {
        header: MatchEventHeader {
            signer: Some(ctx.accounts.operator.key()),
            config: ctx.accounts.config.key(),
            playmatch: ctx.accounts.playmatch.key(),
        },
    });
    Ok(())
}

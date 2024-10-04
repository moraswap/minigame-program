use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};
use game_config::GameConfig;
use pool::Pool;

#[derive(Accounts)]
pub struct CreatePool<'info> {
    pub config: Box<Account<'info, GameConfig>>,

    pub locked_token_mint: Account<'info, Mint>,
    pub reward_token_mint: Account<'info, Mint>,

    #[account(init,
        payer = authority,
        space = Pool::LEN)]
    pub pool: Box<Account<'info, Pool>>,

    #[account(mut, address = config.authority)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<CreatePool>) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    let locked_token_mint = ctx.accounts.locked_token_mint.key();
    let reward_token_mint = ctx.accounts.reward_token_mint.key();

    pool.create(
        ctx.accounts.config.key(),
        locked_token_mint,
        reward_token_mint,
    )?;

    emit!(CreatePoolEvent {
        header: PoolEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            pool: pool.key(),
        },
        locked_token_mint,
        reward_token_mint,
    });
    Ok(())
}

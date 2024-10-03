use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use game_config::GameConfig;
use pool::Pool;

#[derive(Accounts)]
pub struct UpdateLockedTokenAmount<'info> {
    pub config: Account<'info, GameConfig>,
    #[account(mut, has_one = config)]
    pub pool: Account<'info, Pool>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateLockedTokenAmount>, locked_token_amount: u64) -> Result<()> {
    let old_locked_token_amount = ctx.accounts.pool.locked_token_amount;

    ctx.accounts
        .pool
        .update_locked_token_amount(locked_token_amount);

    emit!(UpdateLockedTokenAmountEvent {
        header: PoolEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            pool: ctx.accounts.pool.key(),
        },
        old_locked_token_amount: old_locked_token_amount,
        new_locked_token_amount: locked_token_amount,
    });
    Ok(())
}

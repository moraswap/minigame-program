use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use game_config::GameConfig;
use pool::Pool;

#[derive(Accounts)]
pub struct UpdateRewardTokenAmount<'info> {
    pub config: Account<'info, GameConfig>,
    #[account(mut, has_one = config)]
    pub pool: Account<'info, Pool>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateRewardTokenAmount>, reward_token_amount: u64) -> Result<()> {
    let old_reward_token_amount = ctx.accounts.pool.reward_token_amount;

    ctx.accounts
        .pool
        .update_reward_token_amount(reward_token_amount);

    emit!(UpdateRewardTokenAmountEvent {
        header: PoolEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            pool: ctx.accounts.pool.key(),
        },
        old_reward_token_amount: old_reward_token_amount,
        new_reward_token_amount: reward_token_amount,
    });
    Ok(())
}

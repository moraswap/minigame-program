use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use game_config::GameConfig;

#[derive(Accounts)]
pub struct UpdateRewardTokenAmount<'info> {
    #[account(mut)]
    pub config: Box<Account<'info, GameConfig>>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateRewardTokenAmount>, reward_token_amount: u64) -> Result<()> {
    let old_reward_token_amount = ctx.accounts.config.reward_token_amount;

    ctx.accounts
        .config
        .update_reward_token_amount(reward_token_amount);

    emit!(UpdateRewardTokenAmountEvent {
        header: ConfigEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            config: ctx.accounts.config.key(),
        },
        old_reward_token_amount: old_reward_token_amount,
        new_reward_token_amount: reward_token_amount,
    });
    Ok(())
}

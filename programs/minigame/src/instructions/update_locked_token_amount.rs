use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use game_config::GameConfig;

#[derive(Accounts)]
pub struct UpdateLockedTokenAmount<'info> {
    #[account(mut)]
    pub config: Account<'info, GameConfig>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateLockedTokenAmount>, locked_token_amount: u64) -> Result<()> {
    let old_locked_token_amount = ctx.accounts.config.locked_token_amount;

    ctx.accounts
        .config
        .update_locked_token_amount(locked_token_amount);

    emit!(UpdateLockedTokenAmountEvent {
        header: ConfigEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            config: ctx.accounts.config.key(),
        },
        old_locked_token_amount: old_locked_token_amount,
        new_locked_token_amount: locked_token_amount,
    });
    Ok(())
}

use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use game_config::GameConfig;

#[derive(Accounts)]
pub struct UpdateOperator<'info> {
    #[account(mut)]
    pub config: Account<'info, GameConfig>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,

    /// CHECK: safe, the account that will be new operator can be arbitrary
    pub new_operator: UncheckedAccount<'info>,
}

pub fn handler(ctx: Context<UpdateOperator>) -> Result<()> {
    let old_operator = ctx.accounts.config.operator.key();

    ctx.accounts
        .config
        .update_operator(ctx.accounts.new_operator.key());

    emit!(UpdateOperatorEvent {
        header: ConfigEventHeader {
            signer: Some(ctx.accounts.authority.key()),
            config: ctx.accounts.config.key(),
        },
        old_operator: old_operator,
        new_operator: ctx.accounts.new_operator.key(),
    });
    Ok(())
}

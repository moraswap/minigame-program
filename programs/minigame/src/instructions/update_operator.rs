use crate::state::*;
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

pub fn handler(
    ctx: Context<UpdateOperator>,
) -> Result<()> {
    ctx.accounts
        .config
        .update_operator(ctx.accounts.new_operator.key());
    Ok(())
}

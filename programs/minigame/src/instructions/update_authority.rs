use crate::state::*;
use anchor_lang::prelude::*;
use game_config::GameConfig;

#[derive(Accounts)]
pub struct UpdateAuthority<'info> {
    #[account(mut)]
    pub config: Account<'info, GameConfig>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,

    /// CHECK: safe, the account that will be new authority can be arbitrary
    pub new_authority: UncheckedAccount<'info>,
}

pub fn handler(
    ctx: Context<UpdateAuthority>,
) -> Result<()> {
    ctx.accounts
        .config
        .update_authority(ctx.accounts.new_authority.key());
    Ok(())
}

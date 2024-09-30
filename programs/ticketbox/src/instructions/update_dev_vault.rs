use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;
use ticketbox_config::TicketboxConfig;

#[derive(Accounts)]
pub struct UpdateDevVault<'info> {
    #[account(mut)]
    pub config: Account<'info, TicketboxConfig>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,

    #[account(mut, constraint = dev_vault.mint == config.currency_mint)]
    pub dev_vault: Box<Account<'info, TokenAccount>>,
}

pub fn handler(ctx: Context<UpdateDevVault>) -> Result<()> {
    ctx.accounts
        .config
        .update_dev_vault(ctx.accounts.dev_vault.key());
    Ok(())
}

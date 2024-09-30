use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;
use ticketbox_config::TicketboxConfig;

#[derive(Accounts)]
pub struct UpdateMakerVault<'info> {
    #[account(mut)]
    pub config: Account<'info, TicketboxConfig>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,

    #[account(mut, constraint = maker_vault.mint == config.currency_mint)]
    pub maker_vault: Box<Account<'info, TokenAccount>>,
}

pub fn handler(ctx: Context<UpdateMakerVault>) -> Result<()> {
    ctx.accounts
        .config
        .update_maker_vault(ctx.accounts.maker_vault.key());
    Ok(())
}

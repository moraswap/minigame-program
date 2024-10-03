use crate::{events::*, state::*};
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
    let old_dev_vault = ctx.accounts.config.dev_vault;
    let new_dev_vault = ctx.accounts.dev_vault.key();

    ctx.accounts.config.update_dev_vault(new_dev_vault);

    emit!(UpdateDevVaultEvent {
        header: EventHeader {
            signer: Some(ctx.accounts.authority.key()),
            config: ctx.accounts.config.key(),
        },
        old_dev_vault: old_dev_vault,
        new_dev_vault: new_dev_vault,
    });
    Ok(())
}

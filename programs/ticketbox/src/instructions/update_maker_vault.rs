use crate::{events::*, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;
use ticketbox_config::TicketboxConfig;

#[derive(Accounts)]
pub struct UpdateMakerVault<'info> {
    #[account(mut)]
    pub config: Box<Account<'info, TicketboxConfig>>,

    #[account(address = config.authority)]
    pub authority: Signer<'info>,

    #[account(mut, constraint = maker_vault.mint == config.currency_mint)]
    pub maker_vault: Box<Account<'info, TokenAccount>>,
}

pub fn handler(ctx: Context<UpdateMakerVault>) -> Result<()> {
    let old_maker_vault = ctx.accounts.config.maker_vault;
    let new_maker_vault = ctx.accounts.maker_vault.key();

    ctx.accounts.config.update_maker_vault(new_maker_vault);

    emit!(UpdateMakerVaultEvent {
        header: EventHeader {
            signer: Some(ctx.accounts.authority.key()),
            config: ctx.accounts.config.key(),
        },
        old_maker_vault: old_maker_vault,
        new_maker_vault: new_maker_vault,
    });
    Ok(())
}

use anchor_lang::prelude::*;

declare_id!("6nJR2c9Yj5KdH1GZ9nPKsaHhLKhPW83Men4UgkvUK3Hf");

#[doc(hidden)]
pub mod errors;
#[doc(hidden)]
pub mod events;
#[doc(hidden)]
pub mod instructions;
#[doc(hidden)]
pub mod math;
#[doc(hidden)]
pub mod state;

use instructions::*;

#[program]
pub mod ticketbox {
    use super::*;

    pub fn initialize_config(
        ctx: Context<InitializeConfig>,
        authority: Pubkey,
        ticket_price: u64,
        maker_percent: u16,
        dev_percent: u16,
    ) -> Result<()> {
        return instructions::initialize_config::handler(
            ctx,
            authority,
            ticket_price,
            maker_percent,
            dev_percent,
        );
    }

    pub fn update_authority(ctx: Context<UpdateAuthority>) -> Result<()> {
        return instructions::update_authority::handler(ctx);
    }

    pub fn update_ticket_price(ctx: Context<UpdateTicketPrice>, ticket_price: u64) -> Result<()> {
        return instructions::update_ticket_price::handler(ctx, ticket_price);
    }

    pub fn update_maker_vault(ctx: Context<UpdateMakerVault>) -> Result<()> {
        return instructions::update_maker_vault::handler(ctx);
    }

    pub fn update_dev_vault(ctx: Context<UpdateDevVault>) -> Result<()> {
        return instructions::update_dev_vault::handler(ctx);
    }

    pub fn deposit_ticket_token(ctx: Context<DepositTicketToken>, amount: u64) -> Result<()> {
        return instructions::deposit_ticket_token::handler(ctx, amount);
    }

    pub fn withdraw_ticket_token(ctx: Context<WithdrawTicketToken>, amount: u64) -> Result<()> {
        return instructions::withdraw_ticket_token::handler(ctx, amount);
    }

    pub fn update_percents(
        ctx: Context<UpdatePercents>,
        maker_percent: u16,
        dev_percent: u16,
    ) -> Result<()> {
        return instructions::update_percents::handler(ctx, maker_percent, dev_percent);
    }

    pub fn buy_ticket(ctx: Context<BuyTicket>, amount: u64) -> Result<u64> {
        return instructions::buy_ticket::handler(ctx, amount);
    }
}

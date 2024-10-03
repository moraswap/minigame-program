use crate::errors::ErrorCode;
use crate::math::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer};

#[account]
#[derive(Default, Debug)]
pub struct TicketboxConfig {
    pub authority: Pubkey,

    pub ticket_token_mint: Pubkey,
    pub ticket_token_vault: Pubkey,
    pub currency_mint: Pubkey,
    pub ticket_price: u64,
    pub maker_vault: Pubkey,
    pub maker_percent: u16,
    pub dev_vault: Pubkey,
    pub dev_percent: u16,

    pub transfer_authority_bump: u8,
}

impl TicketboxConfig {
    pub const LEN: usize = 8 + std::mem::size_of::<TicketboxConfig>();

    pub fn initialize(
        &mut self,
        authority: Pubkey,
        ticket_token_mint: Pubkey,
        ticket_token_vault: Pubkey,
        currency_mint: Pubkey,
        ticket_price: u64,
        maker_vault: Pubkey,
        maker_percent: u16,
        dev_vault: Pubkey,
        dev_percent: u16,
        transfer_authority_bump: u8,
    ) -> Result<()> {
        self.update_authority(authority);
        self.update_ticket_token(ticket_token_mint, ticket_token_vault);
        self.update_currency(currency_mint);
        self.update_ticket_price(ticket_price)?;
        self.update_maker_vault(maker_vault);
        self.update_dev_vault(dev_vault);
        self.update_percents(maker_percent, dev_percent)?;
        self.transfer_authority_bump = transfer_authority_bump;

        Ok(())
    }

    pub fn update_authority(&mut self, authority: Pubkey) {
        self.authority = authority;
    }

    pub fn update_ticket_token(&mut self, ticket_token_mint: Pubkey, ticket_token_vault: Pubkey) {
        self.ticket_token_mint = ticket_token_mint;
        self.ticket_token_vault = ticket_token_vault;
    }

    pub fn update_currency(&mut self, currency_mint: Pubkey) {
        self.currency_mint = currency_mint;
    }

    pub fn update_ticket_price(&mut self, ticket_price: u64) -> Result<()> {
        if ticket_price == 0 {
            return Err(ErrorCode::TooSmallTicketPrice.into());
        }

        self.ticket_price = ticket_price;
        Ok(())
    }

    pub fn update_maker_vault(&mut self, maker_vault: Pubkey) {
        self.maker_vault = maker_vault;
    }

    pub fn update_dev_vault(&mut self, dev_vault: Pubkey) {
        self.dev_vault = dev_vault;
    }

    pub fn update_percents(&mut self, maker_percent: u16, dev_percent: u16) -> Result<()> {
        if safe_add(maker_percent as u64, dev_percent as u64)? != 10000 {
            return Err(ErrorCode::BadPercents.into());
        }

        self.maker_percent = maker_percent;
        self.dev_percent = dev_percent;
        Ok(())
    }

    pub fn transfer_tokens<'info>(
        &self,
        token_program: AccountInfo<'info>,
        from: AccountInfo<'info>,
        to: AccountInfo<'info>,
        authority: AccountInfo<'info>,
        amount: u64,
    ) -> Result<()> {
        let authority_seeds: &[&[&[u8]]] =
            &[&[b"transfer_authority", &[self.transfer_authority_bump]]];

        let context = CpiContext::new(
            token_program,
            Transfer {
                from,
                to,
                authority,
            },
        )
        .with_signer(authority_seeds);

        token::transfer(context, amount)?;
        Ok(())
    }

    pub fn transfer_tokens_from_user<'info>(
        &self,
        token_program: AccountInfo<'info>,
        from: AccountInfo<'info>,
        to: AccountInfo<'info>,
        authority: AccountInfo<'info>,
        amount: u64,
    ) -> Result<()> {
        let context = CpiContext::new(
            token_program,
            Transfer {
                from,
                to,
                authority,
            },
        );
        token::transfer(context, amount)?;
        Ok(())
    }
}

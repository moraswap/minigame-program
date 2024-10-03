use crate::errors::ErrorCode;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Transfer};

#[account]
#[derive(Default, Debug)]
pub struct Pool {
    pub config: Pubkey,
    pub bump: [u8; 1],

    pub is_pause: bool,
    pub ticket_token_amount: u64,
    pub fee_rate: u16,
    pub locked_token_mint: Pubkey,
    pub locked_token_vault: Pubkey,
    pub locked_token_amount: u64,
    pub lock_time: u64,
    pub reward_token_mint: Pubkey,
    pub reward_token_vault: Pubkey,
    pub reward_token_amount: u64,
    pub match_time: u64,
}

impl Pool {
    pub const LEN: usize = 8 + std::mem::size_of::<Pool>();

    pub fn seeds(&self) -> [&[u8]; 5] {
        [
            &b"pool"[..],
            self.config.as_ref(),
            self.locked_token_mint.as_ref(),
            self.reward_token_mint.as_ref(),
            self.bump.as_ref(),
        ]
    }

    pub fn initialize(
        &mut self,
        config: Pubkey,
        bump: u8,
        ticket_token_amount: u64,
        fee_rate: u16,
        locked_token_mint: Pubkey,
        locked_token_vault: Pubkey,
        locked_token_amount: u64,
        lock_time: u64,
        reward_token_mint: Pubkey,
        reward_token_vault: Pubkey,
        reward_token_amount: u64,
        match_time: u64,
    ) -> Result<()> {
        self.config = config.key();
        self.bump = [bump];
        self.locked_token_mint = locked_token_mint;
        self.locked_token_vault = locked_token_vault;
        self.reward_token_mint = reward_token_mint;
        self.reward_token_vault = reward_token_vault;
        self.update_ticket_token_amount(ticket_token_amount);
        self.update_fee_rate(fee_rate)?;
        self.update_locked_token_amount(locked_token_amount);
        self.update_lock_time(lock_time);
        self.update_reward_token_amount(reward_token_amount);
        self.update_match_time(match_time);

        Ok(())
    }

    pub fn update_ticket_token_amount(&mut self, ticket_token_amount: u64) {
        self.ticket_token_amount = ticket_token_amount;
    }

    pub fn update_fee_rate(&mut self, fee_rate: u16) -> Result<()> {
        if fee_rate > 10000 {
            return Err(ErrorCode::FeeRateMaxExceeded.into());
        }

        self.fee_rate = fee_rate;

        Ok(())
    }

    pub fn update_locked_token_amount(&mut self, locked_token_amount: u64) {
        self.locked_token_amount = locked_token_amount;
    }

    pub fn update_lock_time(&mut self, lock_time: u64) {
        self.lock_time = lock_time;
    }

    pub fn update_reward_token_amount(&mut self, reward_token_amount: u64) {
        self.reward_token_amount = reward_token_amount;
    }

    pub fn update_match_time(&mut self, match_time: u64) {
        self.match_time = match_time;
    }

    pub fn pause_or_resume(&mut self) {
        self.is_pause = !self.is_pause;
    }

    pub fn transfer_tokens<'info>(
        &self,
        token_program: AccountInfo<'info>,
        from: AccountInfo<'info>,
        to: AccountInfo<'info>,
        authority: AccountInfo<'info>,
        authority_seeds: &[&[&[u8]]],
        amount: u64,
    ) -> Result<()> {
        let context = CpiContext::new_with_signer(
            token_program,
            Transfer {
                from,
                to,
                authority,
            },
            authority_seeds,
        );

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

    pub fn burn_tokens<'info>(
        &self,
        token_program: AccountInfo<'info>,
        mint: AccountInfo<'info>,
        from: AccountInfo<'info>,
        authority: AccountInfo<'info>,
        authority_seeds: &[&[&[u8]]],
        amount: u64,
    ) -> Result<()> {
        let context = CpiContext::new(
            token_program,
            Burn {
                mint,
                from,
                authority,
            },
        )
        .with_signer(authority_seeds);

        token::burn(context, amount)?;
        Ok(())
    }
}

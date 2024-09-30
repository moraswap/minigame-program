use crate::errors::ErrorCode;
use crate::state::game_config::GameConfig;
use anchor_lang::{prelude::*, solana_program};
use solana_program::clock::Clock;

#[account]
#[derive(Default, Debug)]
pub struct PlayMatch {
    pub config: Pubkey,

    pub match_mint: Pubkey,
    pub user: Pubkey,
    pub ticket_token_mint: Pubkey,
    pub ticket_token_amount: u64,
    pub locked_token_mint: Pubkey,
    pub locked_token_amount: u64,
    pub reward_token_mint: Pubkey,
    pub reward_token_amount: u64,
    pub end_time: u64,
    pub is_win: bool,
    pub is_fulfilled: bool,
    pub unlock_time: u64,
    pub is_unlocked: bool,
}

impl PlayMatch {
    pub const LEN: usize = 8 + std::mem::size_of::<PlayMatch>();

    pub fn initialize(
        &mut self,
        config: &Account<GameConfig>,
        match_mint: Pubkey,
        user: Pubkey,
    ) -> Result<()> {
        if config.is_pause {
            return Err(ErrorCode::Paused.into());
        }

        self.config = config.key();
        self.match_mint = match_mint;
        self.user = user;
        self.ticket_token_mint = config.ticket_token_mint;
        self.ticket_token_amount = config.ticket_token_amount;
        self.locked_token_mint = config.locked_token_mint;
        self.locked_token_amount = config.locked_token_amount;
        self.reward_token_mint = config.reward_token_mint;
        self.reward_token_amount = config.reward_token_amount;

        let clock = Clock::get()?;
        let now = clock.unix_timestamp as u64;
        self.end_time = now + config.match_time;

        Ok(())
    }

    pub fn fulfill(&mut self, config: &Account<GameConfig>, is_win: bool) -> Result<()> {
        let clock = Clock::get()?;
        let now = clock.unix_timestamp as u64;
        if now < self.end_time {
            return Err(ErrorCode::TooEarly.into());
        }

        if is_win {
            self.is_win = true;
        } else {
            self.is_win = false;
            self.unlock_time = now + config.lock_time;
        }

        self.is_fulfilled = true;

        Ok(())
    }

    pub fn unlock(&mut self) -> Result<()> {
        if self.unlock_time == 0 {
            return Err(ErrorCode::CannotUnlock.into());
        }
        if self.is_unlocked {
            return Err(ErrorCode::Unlocked.into());
        }

        let clock = Clock::get()?;
        let now = clock.unix_timestamp as u64;
        if self.unlock_time > now {
            return Err(ErrorCode::TooEarly.into());
        }

        self.is_unlocked = true;

        Ok(())
    }
}

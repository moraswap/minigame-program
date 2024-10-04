use anchor_lang::prelude::*;

#[account]
#[derive(Default, Debug)]
pub struct Pool {
    pub config: Pubkey,

    pub is_pause: bool,
    pub locked_token_mint: Pubkey,
    pub locked_token_vault: Pubkey,
    pub locked_token_amount: u64,
    pub reward_token_mint: Pubkey,
    pub reward_token_vault: Pubkey,
    pub reward_token_amount: u64,
}

impl Pool {
    pub const LEN: usize = 8 + std::mem::size_of::<Pool>();

    pub fn create(
        &mut self,
        config: Pubkey,
        locked_token_mint: Pubkey,
        reward_token_mint: Pubkey,
    ) -> Result<()> {
        self.config = config.key();
        self.locked_token_mint = locked_token_mint;
        self.reward_token_mint = reward_token_mint;

        Ok(())
    }

    pub fn initialize(
        &mut self,
        config: Pubkey,
        locked_token_vault: Pubkey,
        locked_token_amount: u64,
        reward_token_vault: Pubkey,
        reward_token_amount: u64,
    ) -> Result<()> {
        self.config = config.key();
        self.locked_token_vault = locked_token_vault;
        self.reward_token_vault = reward_token_vault;
        self.update_locked_token_amount(locked_token_amount);
        self.update_reward_token_amount(reward_token_amount);

        Ok(())
    }

    pub fn update_locked_token_amount(&mut self, locked_token_amount: u64) {
        self.locked_token_amount = locked_token_amount;
    }

    pub fn update_reward_token_amount(&mut self, reward_token_amount: u64) {
        self.reward_token_amount = reward_token_amount;
    }

    pub fn pause_or_resume(&mut self) {
        self.is_pause = !self.is_pause;
    }
}

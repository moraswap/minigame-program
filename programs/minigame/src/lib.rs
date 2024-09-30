use anchor_lang::prelude::*;

declare_id!("7bumD7T74PT4oneNgJgcxzuMa7B4cyh5hRyyT8jH4sXa");

#[doc(hidden)]
pub mod errors;
#[doc(hidden)]
pub mod instructions;
#[doc(hidden)]
pub mod state;
#[doc(hidden)]
pub mod math;

use instructions::*;

#[program]
pub mod minigame {
    use super::*;

    pub fn initialize_config(
        ctx: Context<InitializeConfig>,
        authority: Pubkey,
        operator: Pubkey,
        ticket_token_amount: u64,
        fee_rate: u16,
        locked_token_amount: u64,
        lock_time: u64,
        reward_token_amount: u64,
        match_time: u64,
    ) -> Result<()> {
        return instructions::initialize_config::handler(
            ctx,
            authority,
            operator,
            ticket_token_amount,
            fee_rate,
            locked_token_amount,
            lock_time,
            reward_token_amount,
            match_time,
        );
    }

    pub fn update_authority(ctx: Context<UpdateAuthority>) -> Result<()> {
        return instructions::update_authority::handler(ctx);
    }

    pub fn update_operator(ctx: Context<UpdateOperator>) -> Result<()> {
        return instructions::update_operator::handler(ctx);
    }

    pub fn pause_or_resume(ctx: Context<PauseOrResume>) -> Result<()> {
        return instructions::pause_or_resume::handler(ctx);
    }

    pub fn update_ticket_token_amount(ctx: Context<UpdateTicketTokenAmount>, ticket_token_amount: u64) -> Result<()> {
        return instructions::update_ticket_token_amount::handler(ctx, ticket_token_amount);
    }

    pub fn update_fee_rate(ctx: Context<UpdateFeeRate>, fee_rate: u16) -> Result<()> {
        return instructions::update_fee_rate::handler(ctx, fee_rate);
    }

    pub fn update_locked_token_amount(ctx: Context<UpdateLockedTokenAmount>, locked_token_amount: u64) -> Result<()> {
        return instructions::update_locked_token_amount::handler(ctx, locked_token_amount);
    }

    pub fn update_lock_time(ctx: Context<UpdateLockTime>, lock_time: u64) -> Result<()> {
        return instructions::update_lock_time::handler(ctx, lock_time);
    }

    pub fn update_reward_token_amount(ctx: Context<UpdateRewardTokenAmount>, reward_token_amount: u64) -> Result<()> {
        return instructions::update_reward_token_amount::handler(ctx, reward_token_amount);
    }

    pub fn update_match_time(ctx: Context<UpdateMatchTime>, match_time: u64) -> Result<()> {
        return instructions::update_match_time::handler(ctx, match_time);
    }

    pub fn deposit_reward_token(ctx: Context<DepositRewardToken>, amount: u64) -> Result<()> {
        return instructions::deposit_reward_token::handler(ctx, amount);
    }

    pub fn withdraw_reward_token(ctx: Context<WithdrawRewardToken>, amount: u64) -> Result<()> {
        return instructions::withdraw_reward_token::handler(ctx, amount);
    }

    pub fn play(ctx: Context<Play>) -> Result<()> {
        return instructions::play::handler(ctx);
    }

    pub fn fulfill(ctx: Context<Fulfill>, is_win: bool) -> Result<()> {
        return instructions::fulfill::handler(ctx, is_win);
    }

    pub fn unlock(ctx: Context<Unlock>) -> Result<()> {
        return instructions::unlock::handler(ctx);
    }
}

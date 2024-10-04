use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ConfigEventHeader {
    pub signer: Option<Pubkey>,
    pub config: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct PoolEventHeader {
    pub signer: Option<Pubkey>,
    pub pool: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MatchEventHeader {
    pub signer: Option<Pubkey>,
    pub config: Pubkey,
    pub pool: Pubkey,
    pub playmatch: Pubkey,
}

#[event]
pub struct InitializeConfigEvent {
    pub header: ConfigEventHeader,
    pub authority: Pubkey,
    pub operator: Pubkey,
    pub ticket_token_mint: Pubkey,
    pub ticket_token_vault: Pubkey,
    pub ticket_token_amount: u64,
    pub fee_rate: u16,
    pub lock_time: u64,
    pub match_time: u64,
}

#[event]
pub struct UpdateAuthorityEvent {
    pub header: ConfigEventHeader,
    pub old_authority: Pubkey,
    pub new_authority: Pubkey,
}

#[event]
pub struct UpdateOperatorEvent {
    pub header: ConfigEventHeader,
    pub old_operator: Pubkey,
    pub new_operator: Pubkey,
}

#[event]
pub struct CreatePoolEvent {
    pub header: PoolEventHeader,
    pub locked_token_mint: Pubkey,
    pub reward_token_mint: Pubkey,
}

#[event]
pub struct InitializePoolEvent {
    pub header: PoolEventHeader,
    pub locked_token_vault: Pubkey,
    pub locked_token_amount: u64,
    pub reward_token_vault: Pubkey,
    pub reward_token_amount: u64,
}

#[event]
pub struct UpdateFeeRateEvent {
    pub header: ConfigEventHeader,
    pub old_fee_rate: u16,
    pub new_fee_rate: u16,
}

#[event]
pub struct UpdateLockTimeEvent {
    pub header: ConfigEventHeader,
    pub old_lock_time: u64,
    pub new_lock_time: u64,
}

#[event]
pub struct UpdateMatchTimeEvent {
    pub header: ConfigEventHeader,
    pub old_match_time: u64,
    pub new_match_time: u64,
}

#[event]
pub struct UpdateTicketTokenAmountEvent {
    pub header: ConfigEventHeader,
    pub old_ticket_token_amount: u64,
    pub new_ticket_token_amount: u64,
}

#[event]
pub struct UpdateLockedTokenAmountEvent {
    pub header: PoolEventHeader,
    pub old_locked_token_amount: u64,
    pub new_locked_token_amount: u64,
}

#[event]
pub struct UpdateRewardTokenAmountEvent {
    pub header: PoolEventHeader,
    pub old_reward_token_amount: u64,
    pub new_reward_token_amount: u64,
}

#[event]
pub struct PauseEvent {
    pub header: PoolEventHeader,
}

#[event]
pub struct ResumeEvent {
    pub header: PoolEventHeader,
}

#[event]
pub struct DepositRewardTokenEvent {
    pub header: PoolEventHeader,
    pub funder: Pubkey,
    pub amount: u64,
}

#[event]
pub struct WithdrawRewardTokenEvent {
    pub header: PoolEventHeader,
    pub reward_token_to_vault: Pubkey,
    pub amount: u64,
}

#[event]
pub struct PlayEvent {
    pub header: MatchEventHeader,
    pub funder: Pubkey,
    pub match_mint: Pubkey,
    pub ticket_token_amount: u64,
    pub locked_token_amount: u64,
    pub reward_token_amount: u64,
}

#[event]
pub struct FulfillEvent {
    pub header: MatchEventHeader,
    pub is_win: bool,
}

#[event]
pub struct UnlockEvent {
    pub header: MatchEventHeader,
}

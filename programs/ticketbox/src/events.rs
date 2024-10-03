use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct EventHeader {
    pub signer: Option<Pubkey>,
    pub config: Pubkey,
}

#[event]
pub struct InitializeConfigEvent {
    pub header: EventHeader,
    pub authority: Pubkey,
    pub ticket_token_mint: Pubkey,
    pub ticket_token_vault: Pubkey,
    pub currency_mint: Pubkey,
    pub ticket_price: u64,
    pub maker_vault: Pubkey,
    pub maker_percent: u16,
    pub dev_vault: Pubkey,
    pub dev_percent: u16,
}

#[event]
pub struct UpdateAuthorityEvent {
    pub header: EventHeader,
    pub old_authority: Pubkey,
    pub new_authority: Pubkey,
}

#[event]
pub struct UpdateMakerVaultEvent {
    pub header: EventHeader,
    pub old_maker_vault: Pubkey,
    pub new_maker_vault: Pubkey,
}

#[event]
pub struct UpdateDevVaultEvent {
    pub header: EventHeader,
    pub old_dev_vault: Pubkey,
    pub new_dev_vault: Pubkey,
}

#[event]
pub struct UpdateTicketPriceEvent {
    pub header: EventHeader,
    pub old_ticket_price: u64,
    pub new_ticket_price: u64,
}

#[event]
pub struct UpdatePercentsEvent {
    pub header: EventHeader,
    pub old_maker_percent: u16,
    pub old_dev_percent: u16,
    pub new_maker_percent: u16,
    pub new_dev_percent: u16,
}

#[event]
pub struct DepositTicketTokenEvent {
    pub header: EventHeader,
    pub funder: Pubkey,
    pub amount: u64,
}

#[event]
pub struct WithdrawTicketTokenEvent {
    pub header: EventHeader,
    pub ticket_token_to_vault: Pubkey,
    pub amount: u64,
}

#[event]
pub struct BuyTicketEvent {
    pub header: EventHeader,
    pub funder: Pubkey,
    pub ticket_token_user_vault: Pubkey,
    pub ticket_amount: u64,
    pub total_currency: u64,
}
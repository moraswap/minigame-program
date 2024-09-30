use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("TooSmallTicketPrice")]
    TooSmallTicketPrice,
    #[msg("BadPercents")]
    BadPercents,

    #[msg("AddOverflow")]
    AddOverflow,
    #[msg("SubOverflow")]
    SubOverflow,
    #[msg("MulOverflow")]
    MulOverflow,
    #[msg("DivByZero")]
    DivByZero,
}

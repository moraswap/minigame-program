use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("FeeRateMaxExceeded")]
    FeeRateMaxExceeded,
    #[msg("Paused")]
    Paused,
    #[msg("TooEarly")]
    TooEarly,
    #[msg("Fulfilled")]
    Fulfilled,
    #[msg("Unlocked")]
    Unlocked,
    #[msg("CannotUnlock")]
    CannotUnlock,
    
    #[msg("AddOverflow")]
    AddOverflow,
    #[msg("SubOverflow")]
    SubOverflow,
    #[msg("MulOverflow")]
    MulOverflow,
    #[msg("DivByZero")]
    DivByZero,
}

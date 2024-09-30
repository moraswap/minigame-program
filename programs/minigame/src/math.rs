use crate::errors::ErrorCode;
use anchor_lang::prelude::*;

pub fn safe_add(a: u64, b: u64) -> Result<u64> {
    a.checked_add(b).ok_or(ErrorCode::AddOverflow.into())
}

pub fn safe_sub(a: u64, b: u64) -> Result<u64> {
    a.checked_sub(b).ok_or(ErrorCode::SubOverflow.into())
}

pub fn safe_mul(a: u64, b: u64) -> Result<u64> {
    a.checked_mul(b).ok_or(ErrorCode::MulOverflow.into())
}

pub fn safe_div(a: u64, b: u64) -> Result<u64> {
    a.checked_div(b).ok_or(ErrorCode::DivByZero.into())
}

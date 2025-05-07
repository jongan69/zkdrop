// state.rs
use anchor_lang::prelude::*;

#[account]
pub struct TokenDistribution {
    pub merkle_root: [u8; 32],
    pub total_allocation: u64,
    pub bump: u8,
}

#[account]
pub struct ClaimStatus {
    pub claimed: bool,
}
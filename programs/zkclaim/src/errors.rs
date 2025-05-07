// errors.rs
use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("Already claimed")] 
    AlreadyClaimed,
    #[msg("Invalid Merkle proof")]
    InvalidProof,
}
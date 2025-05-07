// lib.rs
use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;
pub mod utils;

use instructions::*;

declare_id!("Distxxxxx1111111111111111111111111111111111");

#[program]
pub mod claimable_tokens_anchor {
    use super::*;

    pub fn initialize_token_distribution(
        ctx: Context<InitializeTokenDistribution>,
        merkle_root: [u8; 32],
        total_allocation: u64,
    ) -> Result<()> {
        instructions::initialize_token_distribution(ctx, merkle_root, total_allocation)
    }

    pub fn claim_compressed_tokens(
        ctx: Context<ClaimCompressedTokens>,
        claim_amount: u64,
        proof: Vec<[u8; 32]>,
    ) -> Result<()> {
        instructions::claim_compressed_tokens(ctx, claim_amount, proof)
    }
}
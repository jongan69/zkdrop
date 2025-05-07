// instructions.rs
use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::CustomError;
use crate::utils::*;

#[derive(Accounts)]
pub struct InitializeTokenDistribution<'info> {
    #[account(init, payer = creator, space = 8 + 32 + 8 + 1, seeds = [b"dist"], bump)]
    pub distribution: Account<'info, TokenDistribution>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_token_distribution(
    ctx: Context<InitializeTokenDistribution>,
    merkle_root: [u8; 32],
    total_allocation: u64,
) -> Result<()> {
    let dist = &mut ctx.accounts.distribution;
    dist.merkle_root = merkle_root;
    dist.total_allocation = total_allocation;
    dist.bump = ctx.bumps.distribution;
    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct ClaimCompressedTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut, seeds = [b"dist"], bump = distribution.bump)]
    pub distribution: Account<'info, TokenDistribution>,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 1,
        seeds = [b"claim", user.key().as_ref()],
        bump
    )]
    pub claim_status: Account<'info, ClaimStatus>,

    /// CHECK: Could be claim pool or proof account for CPI
    pub claim_pool: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

pub fn claim_compressed_tokens(
    ctx: Context<ClaimCompressedTokens>,
    claim_amount: u64,
    proof: Vec<[u8; 32]>,
) -> Result<()> {
    let status = &mut ctx.accounts.claim_status;
    require!(!status.claimed, CustomError::AlreadyClaimed);

    let user_key = ctx.accounts.user.key();
    let leaf = hash_leaf(&(user_key, claim_amount));
    require!(verify_merkle_proof(&leaf, &ctx.accounts.distribution.merkle_root, &proof), CustomError::InvalidProof);

    status.claimed = true;

    // Here you'd add the CPI to your compressed token program to actually transfer tokens
    // e.g., call a CPI to light_compressed_token::transfer()

    Ok(())
}
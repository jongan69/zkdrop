// utils.rs
use anchor_lang::prelude::*;
use anchor_lang::solana_program::keccak::hashv;

pub fn hash_leaf(input: &(Pubkey, u64)) -> [u8; 32] {
    hashv(&[input.0.as_ref(), &input.1.to_le_bytes()]).0
}

pub fn verify_merkle_proof(leaf: &[u8; 32], root: &[u8; 32], proof: &Vec<[u8; 32]>) -> bool {
    let mut computed_hash = *leaf;
    for node in proof.iter() {
        let (a, b) = if computed_hash <= *node {
            (computed_hash, *node)
        } else {
            (*node, computed_hash)
        };
        computed_hash = hashv(&[&a, &b]).0;
    }
    &computed_hash == root
}
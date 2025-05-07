import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Zkclaim } from "../target/types/zkclaim";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { expect } from "chai";

describe("zkclaim", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.zkclaim as Program<Zkclaim>;
  const provider = anchor.getProvider();

  // Test values
  const merkleRoot = new Array(32).fill(1); // [1,1,1,...]
  const totalAllocation = new anchor.BN(1000);

  // PDAs
  let [distributionPda] = [null];
  let creator = provider.wallet;

  it("Initializes token distribution", async () => {
    [distributionPda] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("dist")],
      program.programId
    );

    const tx = await program.methods
      .initializeTokenDistribution(merkleRoot, totalAllocation)
      .accounts({
        distribution: distributionPda,
        creator: creator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Init tx:", tx);

    // Fetch and check state
    const distAccount = await program.account.tokenDistribution.fetch(distributionPda);
    expect(distAccount.merkleRoot).to.deep.equal(merkleRoot);
    expect(distAccount.totalAllocation.toString()).to.equal(totalAllocation.toString());
  });

  it("Fails to claim with invalid proof", async () => {
    const user = Keypair.generate();
    const claimAmount = new anchor.BN(100);
    const fakeProof = [new Array(32).fill(2)]; // obviously invalid

    // Derive claim_status PDA
    const [claimStatusPda] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("claim"), user.publicKey.toBuffer()],
      program.programId
    );

    // Airdrop to user for fees
    await provider.connection.requestAirdrop(user.publicKey, 1e9);

    try {
      await program.methods
        .claimCompressedTokens(claimAmount, fakeProof)
        .accounts({
          user: user.publicKey,
          distribution: distributionPda,
          claimStatus: claimStatusPda,
          claimPool: user.publicKey, // dummy
          systemProgram: SystemProgram.programId,
        })
        .signers([user])
        .rpc();
      throw new Error("Should have failed");
    } catch (e) {
      expect(e.message).to.match(/Invalid Merkle proof/);
    }
  });
});
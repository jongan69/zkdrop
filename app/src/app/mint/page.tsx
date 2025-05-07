"use client";
import React, { useState, useCallback } from "react";
import {
  CompressedTokenProgram,
  getTokenPoolInfos,
  selectTokenPoolInfo,
} from "@lightprotocol/compressed-token";
import {
  createRpc,
  selectStateTreeInfo,
} from "@lightprotocol/stateless.js";
import { Transaction, LAMPORTS_PER_SOL, Keypair } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { UPLOAD_IPFS_IMAGE } from "@/lib/constants";
import { QRCodeCanvas } from "qrcode.react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";

const cardStyle = {
  background: '#161616',
  borderRadius: 16,
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  padding: '2rem',
  minWidth: 340,
  maxWidth: 400,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
};
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
};
const inputStyle = {
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
  fontSize: 16,
  outline: 'none',
  transition: 'border 0.2s',
  background: '#161616',
  display: 'block',
  width: '100%',
  minHeight: 44,
};
const inputFocusStyle = {
  border: '1.5px solid #6366f1',
};
const buttonStyle = {
  padding: '12px 0',
  borderRadius: 8,
  border: 'none',
  background: 'linear-gradient(90deg, #e0fa35 0%, #60a5fa 100%)',
  color: '#000',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(99,102,241,0.08)',
  transition: 'background 0.2s, box-shadow 0.2s',
};
const buttonDisabledStyle = {
  background: '#161616',
  color: '#a1a1aa',
  cursor: 'not-allowed',
  boxShadow: 'none',
};
const labelStyle = {
  fontWeight: 500,
  marginBottom: 6,
  color: '#374151',
  fontSize: 15,
  display: 'block',
  position: 'relative',
  zIndex: 1,
};
const statusStyle = {
  marginTop: 12,
  marginBottom: 12,
  padding: '20px',
  borderRadius: 8,
  background: '#000',
  color: '#e0fa35',
  fontWeight: 500,
  fontSize: 15,
  wordBreak: 'break-all',
  border: '1px solid #e0fa35',
};
const qrContainerStyle = {
  marginTop: 20,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
};
const codeBlockStyle = {
  color: '#e0fa35',
  backgroundColor: '#000',
  fontWeight: 600,
  fontSize: 16,
  padding: '10px 14px',
  borderRadius: 6,
  wordBreak: 'break-all',
  display: 'block',
  textAlign: 'center',
  margin: '0 auto',
};

export default function MintPage() {
  return <MintForm />;
}

const MintForm = () => {
  const { publicKey, connected, signTransaction } = useWallet();
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenImage, setTokenImage] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [tokenLink, setTokenLink] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [mintAddress, setMintAddress] = useState("");
  const [mintTx, setMintTx] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [error, setError] = useState("");
  const [mintCost, setMintCost] = useState<number | null>(null);
  const [costLoading, setCostLoading] = useState(false);

  // Estimate the cost to mint (rent + tx fees)
  React.useEffect(() => {
    let cancelled = false;
    async function estimateCost() {
      setCostLoading(true);
      setMintCost(null);
      try {
        const connection = createRpc(
          process.env.NEXT_PUBLIC_HELIUS_RPC_URL!,
          process.env.NEXT_PUBLIC_HELIUS_RPC_URL!,
          process.env.NEXT_PUBLIC_HELIUS_RPC_URL!
        );
        // Mint account size is 82 bytes (SPL Token standard)
        const mintRent = await connection.getMinimumBalanceForRentExemption(82);
        // Estimate 2 transactions (createMint, mintTo), each ~0.00001 SOL fee, add buffer
        const txFees = 0.001 * LAMPORTS_PER_SOL; // 0.001 SOL buffer
        const total = mintRent + txFees;
        if (!cancelled) setMintCost(total);
      } catch {
        if (!cancelled) setMintCost(null);
      }
      if (!cancelled) setCostLoading(false);
    }
    estimateCost();
    return () => { cancelled = true; };
  }, [publicKey, connected]);

  // Main mint handler
  const onMint = useCallback(async () => {
    setError("");
    setMintAddress("");
    setMintTx("");
    setQrValue("");
    if (!publicKey || !connected) {
      setError("Connect your wallet to mint.");
      return;
    }
    setIsMinting(true);
    try {
      console.log("[1] Creating RPC connection...");
      const connection = createRpc(
        process.env.NEXT_PUBLIC_HELIUS_RPC_URL!,
        process.env.NEXT_PUBLIC_HELIUS_RPC_URL!,
        process.env.NEXT_PUBLIC_HELIUS_RPC_URL!
      );
      console.log("[1] Connection created.");
      // 2. Build createMint instructions
      console.log("[2] Generating mint keypair...");
      const mintKeypair = Keypair.generate();
      console.log("[2] Mint keypair generated:", mintKeypair.publicKey.toBase58());
      console.log("[3] Building createMint instructions...");
      const rentExemptBalance = await connection.getMinimumBalanceForRentExemption(82);
      const createMintIx = await CompressedTokenProgram.createMint({
        feePayer: publicKey,
        authority: publicKey,
        mint: mintKeypair.publicKey,
        decimals: 9,
        freezeAuthority: null,
        rentExemptBalance,
      });
      console.log("[3] createMintIx built:", createMintIx);
      // 3. Build and sign createMint transaction
      const tx1 = new Transaction().add(...createMintIx);
      tx1.feePayer = publicKey;
      tx1.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      console.log("[4] Transaction for mint creation built:", tx1);
      // Partially sign with mintKeypair
      tx1.partialSign(mintKeypair);
      console.log("[5] Transaction partially signed with mintKeypair.");
      // Ask wallet to sign (returns a fully signed transaction)
      if (!signTransaction) {
        setError("Wallet does not support direct transaction signing.");
        setIsMinting(false);
        console.error("[ERROR] Wallet does not support direct transaction signing.");
        return;
      }
      console.log("[6] Requesting wallet signature...");
      const signedTx1 = await signTransaction(tx1);
      console.log("[6] Wallet signed transaction.");
      // Send the fully signed transaction
      console.log("[7] Sending raw transaction for mint creation...");
      const sig1 = await connection.sendRawTransaction(signedTx1.serialize());
      console.log("[7] Mint creation tx signature:", sig1);
      setMintTx(sig1);
      setMintAddress(mintKeypair.publicKey.toBase58());
      console.log("[8] Confirming mint creation transaction...");
      await connection.confirmTransaction({
        signature: sig1,
        blockhash: tx1.recentBlockhash,
        lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight
      }, "confirmed");
      console.log("[8] Mint creation transaction confirmed.");
      // 5. Create the token pool for the new mint
      console.log("[9] Checking if token pool already exists...");
      const tokenPoolInfos = await getTokenPoolInfos(connection, mintKeypair.publicKey);
      if (tokenPoolInfos && tokenPoolInfos.length > 0) {
        console.log("[9] Token pool already exists, skipping creation.");
      } else {
        console.log("[9] Token pool does not exist, creating...");
        const createTokenPoolIx = await CompressedTokenProgram.createTokenPool({
          feePayer: publicKey,
          mint: mintKeypair.publicKey,
        });
        console.log("[9] createTokenPoolIx built:", createTokenPoolIx);
        const txPool = new Transaction().add(createTokenPoolIx);
        txPool.feePayer = publicKey;
        txPool.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        console.log("[11] Requesting wallet signature for token pool creation...");
        const signedTxPool = await signTransaction(txPool);
        console.log("[11] Wallet signed token pool creation transaction.");
        const sigPool = await connection.sendRawTransaction(signedTxPool.serialize());
        console.log("[12] Token pool creation tx signature:", sigPool);
        await connection.confirmTransaction({
          signature: sigPool,
          blockhash: txPool.recentBlockhash,
          lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight
        }, "confirmed");
        console.log("[12] Token pool creation transaction confirmed.");
      }
      // 6. Get state tree and token pool
      console.log("[13] Fetching state tree infos...");
      const stateTreeInfos = await connection.getStateTreeInfos();
      const outputStateTreeInfo = selectStateTreeInfo(stateTreeInfos);
      console.log("[13] Selected state tree info:", outputStateTreeInfo);
      const tokenPoolInfo = selectTokenPoolInfo(tokenPoolInfos);
      console.log("[13] Selected token pool info:", tokenPoolInfo);
      // 7. Build mintTo instruction
      console.log("[14] Building mintTo instruction...");
      const mintToIx = await CompressedTokenProgram.mintTo({
        feePayer: publicKey,
        authority: publicKey,
        mint: mintKeypair.publicKey,
        toPubkey: publicKey,
        amount: 1e9,
        outputStateTreeInfo,
        tokenPoolInfo,
      });
      console.log("[14] mintToIx built:", mintToIx);
      // 8. Build and send mintTo transaction
      const tx2 = new Transaction().add(mintToIx);
      tx2.feePayer = publicKey;
      tx2.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      console.log("[15] Transaction for mintTo built.");
      console.log("[16] Requesting wallet signature for mintTo...");
      const signedTx2 = await signTransaction(tx2);
      console.log("[16] Wallet signed mintTo transaction.");
      const sig2 = await connection.sendRawTransaction(signedTx2.serialize());
      console.log("[17] mintTo tx signature:", sig2);
      setMintTx(sig2);
      setQrValue(`${window.location.origin}/claim?mint=${mintKeypair.publicKey.toBase58()}`);
      console.log("[18] Minting process complete. QR value set.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("[ERROR] Minting failed:", err);
      } else {
        setError(String(err));
        console.error("[ERROR] Minting failed:", err);
      }
    }
    setIsMinting(false);
  }, [publicKey, connected, signTransaction]);

  return (
    <section style={{ margin: "2rem 0", padding: 0, background: '#161616', border: 'none', borderRadius: 16 } as React.CSSProperties}>
      <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, color: '#e0fa35', marginBottom: 32, letterSpacing: -1 } as React.CSSProperties}>Mint cToken</h2>
      <div style={{ display: "flex", gap: 40, justifyContent: 'center', flexWrap: 'wrap' } as React.CSSProperties}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <WalletMultiButton style={{ ...buttonStyle, minWidth: 180 }} />
          </div>
        <div style={cardStyle as React.CSSProperties}>
          <form onSubmit={async (e) => { e.preventDefault(); await onMint(); }} style={formStyle as React.CSSProperties}>
            {/* Cost display */}
            <div style={{ marginBottom: 12, textAlign: 'center', color: '#e0fa35', fontWeight: 500, fontSize: 16 }}>
              {costLoading ? (
                <span>Estimating cost...</span>
              ) : mintCost !== null ? (
                <span>Estimated cost to mint: {(mintCost / LAMPORTS_PER_SOL).toFixed(4)} SOL</span>
              ) : (
                <span>Unable to estimate cost</span>
              )}
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' } as React.CSSProperties}>
              <label style={labelStyle as React.CSSProperties}>Token Name</label>
              <input
                type="text"
                placeholder="Token Name"
                value={tokenName}
                onChange={e => setTokenName(e.target.value)}
                required
                style={inputStyle as React.CSSProperties}
                onFocus={e => (e.currentTarget.style.border = inputFocusStyle.border as string)}
                onBlur={e => (e.currentTarget.style.border = inputStyle.border as string)}
              />
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' } as React.CSSProperties}>
              <label style={labelStyle as React.CSSProperties}>Token Symbol</label>
              <input
                type="text"
                placeholder="Token Symbol"
                value={tokenSymbol}
                onChange={e => setTokenSymbol(e.target.value)}
                required
                style={inputStyle as React.CSSProperties}
                onFocus={e => (e.currentTarget.style.border = inputFocusStyle.border as string)}
                onBlur={e => (e.currentTarget.style.border = inputStyle.border as string)}
              />
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' } as React.CSSProperties}>
              <label style={labelStyle as React.CSSProperties}>Token Image</label>
              <input
                type="file"
                accept="image/*"
                style={{ width: '100%' } as React.CSSProperties}
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const uri = await UPLOAD_IPFS_IMAGE(e.target.files[0]);
                    if (uri) setTokenImage(uri);
                  }
                }}
              />
              {tokenImage && (
                <Image
                  src={tokenImage}
                  alt="Token"
                  width={120}
                  height={120}
                  style={{ marginTop: 8, maxWidth: 120, borderRadius: 8 } as React.CSSProperties}
                />
              )}
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' } as React.CSSProperties}>
              <label style={labelStyle as React.CSSProperties}>Description</label>
              <input
                type="text"
                placeholder="Description"
                value={tokenDescription}
                onChange={e => setTokenDescription(e.target.value)}
                style={inputStyle as React.CSSProperties}
                onFocus={e => (e.currentTarget.style.border = inputFocusStyle.border as string)}
                onBlur={e => (e.currentTarget.style.border = inputStyle.border as string)}
              />
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' } as React.CSSProperties}>
              <label style={labelStyle as React.CSSProperties}>External Link</label>
              <input
                type="text"
                placeholder="External Link"
                value={tokenLink}
                onChange={e => setTokenLink(e.target.value)}
                style={inputStyle as React.CSSProperties}
                onFocus={e => (e.currentTarget.style.border = inputFocusStyle.border as string)}
                onBlur={e => (e.currentTarget.style.border = inputStyle.border as string)}
              />
            </div>
            <button
              type="submit"
              disabled={isMinting || !publicKey}
              style={isMinting || !publicKey ? { ...buttonStyle, ...buttonDisabledStyle } as React.CSSProperties : buttonStyle as React.CSSProperties}
            >
              {isMinting ? "Minting..." : "Mint cToken"}
            </button>
          </form>
          {(mintAddress || mintTx || qrValue) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: '100%', alignItems: 'center', marginTop: 24 } as React.CSSProperties}>
              {mintAddress && (
                <div style={statusStyle as React.CSSProperties}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Mint Address:</div>
                  <code style={codeBlockStyle as React.CSSProperties}>{mintAddress}</code>
                </div>
              )}
              {mintTx && (
                <div style={statusStyle as React.CSSProperties}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Mint Tx:</div>
                  <code style={codeBlockStyle as React.CSSProperties}>{mintTx}</code>
                </div>
              )}
              {qrValue && (
                <div style={qrContainerStyle as React.CSSProperties}>
                  <QRCodeCanvas value={qrValue} size={140} />
                  <div style={{ color: '#e0fa35', fontWeight: 500, marginTop: 4 }}>Scan to claim</div>
                </div>
              )}
            </div>
          )}
          {error && <div style={statusStyle as React.CSSProperties}>{error}</div>}
        </div>
      </div>
    </section>
  );
};
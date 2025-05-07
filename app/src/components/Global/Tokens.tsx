import React, { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { UPLOAD_IPFS_IMAGE } from "@/lib/constants";
import { QRCodeCanvas } from 'qrcode.react';

const cardStyle: React.CSSProperties = {
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

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
};

const inputStyle: React.CSSProperties = {
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

const inputFocusStyle: React.CSSProperties = {
  border: '1.5px solid #6366f1',
};

const buttonStyle: React.CSSProperties = {
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

const buttonDisabledStyle: React.CSSProperties = {
  background: '#161616',
  color: '#a1a1aa',
  cursor: 'not-allowed',
  boxShadow: 'none',
};

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  marginBottom: 6,
  color: '#374151',
  fontSize: 15,
  display: 'block',
  position: 'relative',
  zIndex: 1,
};

const statusStyle: React.CSSProperties = {
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

const qrContainerStyle: React.CSSProperties = {
  marginTop: 20,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
};

// Add a style for code blocks
const codeBlockStyle: React.CSSProperties = {
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

const Tokens = ({ publicKey }: { publicKey: PublicKey }) => {
  // cToken minting/claiming state
  const [mintAddress, setMintAddress] = useState("");
  const [mintTx, setMintTx] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [claimInput, setClaimInput] = useState("");
  const [claimStatus, setClaimStatus] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  // New: Token metadata form state
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenImage, setTokenImage] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [tokenLink, setTokenLink] = useState("");
  // Mint cToken (for creators)
  async function handleMintCToken(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!publicKey) {
      alert("Connect your wallet to mint.");
      return;
    }
    setIsMinting(true);
    setMintAddress("");
    setMintTx("");
    setQrValue("");
    try {
      // Call backend API to mint cToken
      const res = await fetch("/api/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metadata: {
            name: tokenName,
            symbol: tokenSymbol,
            image: tokenImage,
            description: tokenDescription,
            link: tokenLink,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Mint failed");
      setMintAddress(data.mintAddress);
      setMintTx(data.tx);
      setQrValue(`${process.env.NEXT_PUBLIC_BASE_URL}/claim?mint=${data.mintAddress}`);
    } catch (e) {
      setMintAddress("");
      setMintTx("");
      setQrValue("");
      alert("Mint failed: " + e);
    }
    setIsMinting(false);
  }

  // Claim cToken (for attendees)
  async function handleClaimCToken() {
    setIsClaiming(true);
    setClaimStatus("");
    try {
      if (!publicKey) throw new Error("Connect your wallet to claim");
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mintAddress: claimInput,
          recipient: publicKey.toBase58(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Claim failed");
      setClaimStatus("Claimed! tx: " + data.tx);
    } catch (e) {
      setClaimStatus("Claim failed: " + e);
    }
    setIsClaiming(false);
  }
  return (
    <section style={{ margin: "2rem 0", padding: 0, background: '#161616', border: 'none', borderRadius: 16 }}>
      <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, color: '#e0fa35', marginBottom: 32, letterSpacing: -1 }}>cToken Proof-of-Participation (POP) Demo</h2>
      <div style={{ display: "flex", gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* Mint cToken (for creators) */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: '#e0fa35', marginBottom: 8 }}>Creator: Mint cToken</h3>
          <form onSubmit={handleMintCToken} style={formStyle}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>Token Name</label>
              <input
                type="text"
                placeholder="Token Name"
                value={tokenName}
                onChange={e => setTokenName(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.border = inputFocusStyle.border as string)}
                onBlur={e => (e.currentTarget.style.border = inputStyle.border as string)}
              />
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>Token Symbol</label>
              <input
                type="text"
                placeholder="Token Symbol"
                value={tokenSymbol}
                onChange={e => setTokenSymbol(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.border = inputFocusStyle.border as string)}
                onBlur={e => (e.currentTarget.style.border = inputStyle.border as string)}
              />
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>Token Image</label>
              <input
                type="file"
                accept="image/*"
                style={{ width: '100%' }}
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const uri = await UPLOAD_IPFS_IMAGE(e.target.files[0]);
                    if (uri) setTokenImage(uri);
                  }
                }}
              />
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>Description</label>
              <input
                type="text"
                placeholder="Description"
                value={tokenDescription}
                onChange={e => setTokenDescription(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.border = inputFocusStyle.border as string)}
                onBlur={e => (e.currentTarget.style.border = inputStyle.border as string)}
              />
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>External Link</label>
              <input
                type="text"
                placeholder="External Link"
                value={tokenLink}
                onChange={e => setTokenLink(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.border = inputFocusStyle.border as string)}
                onBlur={e => (e.currentTarget.style.border = inputStyle.border as string)}
              />
            </div>
            <button
              type="submit"
              disabled={isMinting}
              style={isMinting ? { ...buttonStyle, ...buttonDisabledStyle } : buttonStyle}
            >
              {isMinting ? "Minting..." : "Mint cToken"}
            </button>
          </form>
          {/* Mint Address, Mint Tx, and QR code with improved spacing and readability */}
          {(mintAddress || mintTx || qrValue) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: '100%', alignItems: 'center', marginTop: 24 }}>
              {mintAddress && (
                <div style={statusStyle}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Mint Address:</div>
                  <code style={codeBlockStyle}>{mintAddress}</code>
                </div>
              )}
              {mintTx && (
                <div style={statusStyle}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Mint Tx:</div>
                  <code style={codeBlockStyle}>{mintTx}</code>
                </div>
              )}
              {qrValue && (
                <div style={qrContainerStyle}>
                  <QRCodeCanvas value={qrValue} size={140} />
                  <div style={{ color: '#e0fa35', fontWeight: 500, marginTop: 4 }}>Scan to claim</div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Claim cToken (for attendees) */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: '#6366f1', marginBottom: 8 }}>Attendee: Claim cToken</h3>
          <div style={formStyle}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>Mint Address</label>
              <input
                type="text"
                placeholder="Paste or scan mint address"
                value={claimInput}
                onChange={e => setClaimInput(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.border = inputFocusStyle.border as string)}
                onBlur={e => (e.currentTarget.style.border = inputStyle.border as string)}
              />
            </div>
            <button
              onClick={handleClaimCToken}
              disabled={isClaiming || !claimInput}
              style={isClaiming || !claimInput ? { ...buttonStyle, ...buttonDisabledStyle } : buttonStyle}
            >
              {isClaiming ? "Claiming..." : "Claim cToken"}
            </button>
            {claimStatus && <div style={statusStyle}>{claimStatus}</div>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tokens;

"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
// import { SHORTEN_ADDRESS } from "../../lib/constants";
// import { FaWallet, TbCurrencySolana } from "@/components/SVG";
import { Connection, PublicKey } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

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
  margin: '2rem auto',
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

function ClaimPageInner() {
  const searchParams = useSearchParams();
  const [claimInput, setClaimInput] = useState("");
  const [claimStatus, setClaimStatus] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const {
    connected,
    publicKey,
  } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const mint = searchParams.get("mint");
    if (mint) setClaimInput(mint);
  }, [searchParams]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const connection = new Connection("https://api.mainnet-beta.solana.com");
          const balance = await connection.getBalance(new PublicKey(publicKey.toString()));
          setBalance(balance / 1e9);
        } catch {
          setBalance(null);
        }
      }
    };
    if (connected) {
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [connected, publicKey]);

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
          recipient: publicKey,
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
      <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, color: '#e0fa35', marginBottom: 32, letterSpacing: -1 }}>Claim cToken</h2>
      <div style={{ display: "flex", justifyContent: 'center' }}>
        <div style={{ ...cardStyle, width: '100%' }}>
          {/* Wallet Connect/Select Button */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <WalletMultiButton style={{ ...buttonStyle, minWidth: 180 }} />
            <h1>{balance}</h1>
          </div>
          {/* End Wallet Button */}
          <form style={formStyle} onSubmit={e => { e.preventDefault(); handleClaimCToken(); }}>
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
                required
              />
            </div>
            <button
              type="submit"
              disabled={isClaiming || !claimInput}
              style={isClaiming || !claimInput ? { ...buttonStyle, ...buttonDisabledStyle } : buttonStyle}
            >
              {isClaiming ? "Claiming..." : "Claim cToken"}
            </button>
            {claimStatus && <div style={statusStyle}>{claimStatus}</div>}
          </form>
        </div>
      </div>
    </section>
  );
}

export default function ClaimPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClaimPageInner />
    </Suspense>
  );
} 
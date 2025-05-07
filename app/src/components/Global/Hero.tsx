import React from "react";
import { FaWallet, FaExternalLinkAlt } from "../SVG/index";
import { PublicKey } from "@solana/web3.js";

const styles = {
  heroBg: {
    background: "linear-gradient(135deg,rgb(0, 0, 0) 0%, #161616 100%)",
    color: "#fff",
    padding: "80px 0 60px 0",
    position: "relative" as const,
    overflow: "hidden",
  },
  overlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "#161616",
    zIndex: 1,
  },
  content: {
    position: "relative" as const,
    zIndex: 2,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start" as const,
    minHeight: 400,
    maxWidth: 900,
    margin: "0 auto",
    padding: "0 24px",
  },
  headline: {
    fontSize: "2.5rem",
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: 20,
    background: "linear-gradient(90deg, #fff 60%, #E0FA35 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: 1,
  },
  sub: {
    fontSize: "1.2rem",
    color: "#e0e7ef",
    marginBottom: 32,
    maxWidth: 520,
  },
  ctaRow: {
    display: "flex",
    gap: 16,
    marginBottom: 40,
  },
  button: {
    background: "#E0FA35",
    color: "#fff",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: "1.1rem",
    boxShadow: "0 4px 24px 0 rgba(99,102,241,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 32px",
    textDecoration: "none",
    transition: "background 0.2s, color 0.2s",
  },
  buttonActive: {
    background: "#fff",
    color: "#6366f1",
    border: "2px solid #E0FA35",
    boxShadow: "0 4px 24px 0 rgba(255,255,255,0.10)",
  },
  centerText: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10,
    textAlign: "center" as const,
    pointerEvents: "none" as const,
    width: "100%",
  },
  centerHeadline: {
    fontSize: "2rem",
    fontWeight: 700,
    background: "linear-gradient(90deg, #fff 60%, #E0FA35 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
    letterSpacing: 1,
  },
  centerSub: {
    fontSize: "1.1rem",
    color: "#e0e7ef",
    marginTop: 8,
  },
  joinNow: {
    background: "#E0FA35",
    color: "#000",
    borderRadius: 8,
    fontWeight: 600,
    padding: "10px 28px",
    marginTop: 32,
    display: "inline-block",
    textDecoration: "none",
    pointerEvents: "auto" as const,
  },
};

const Hero = ({ removeLastItemFromLocalStorage, publicKey }: { removeLastItemFromLocalStorage: () => void, publicKey: PublicKey }) => {
  return (
    <section id="home" style={styles.heroBg}>
      <div style={styles.overlay} />
      <div style={styles.content}>
        <header>
          <h1 style={styles.headline}>
            ZK Compression Minting & Claiming on Solana
          </h1>
          <p style={styles.sub}>
            Unlock the next generation of NFT privacy, scalability, and security. Mint and claim NFTs using Zero-Knowledge proofs and state compression—your transactions, your data, your control. Enjoy seamless, private, and efficient NFT experiences powered by Solana's speed and ZK technology.
          </p>
        </header>
      </div>
      <div style={styles.centerText}>
        <a
          href="#"
          data-toggle="modal"
          data-target="#popup_bid"
          style={styles.joinNow}
        >
          Subscribe Now
        </a>
      </div>
    </section>
  );
};

export default Hero;

"use client";

/**
 * SeekerGuard
 *
 * Vox-style paywall: shows real story content at the top, fades it into
 * a solid bottom panel that prompts the user to connect their Seeker wallet.
 *
 * - Content is fully readable for ~40% of the panel height
 * - A gradient softly blends the content into the solid paywall surface
 * - The paywall card is pinned to the bottom, not floating over blurred content
 * - Checks wallet for Seeker Genesis Token once connected
 */

import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";

const SEEKER_MINT_ADDRESS = "2DMMamkkxQ6zDMBtkFp8KH7FoWzBMBA1CGTYwom4QH6Z";

/* ─── Locked state: content + Vox-style paywall ─────────────────────── */
function GossipPaywall({ onConnect, variant = "not-connected", publicKey, onDisconnect, onBypass }) {
  const isNoToken = variant === "no-token";

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* ── Readable content zone ─────────────────────── */}
      <div
        id="seeker-content-peek"
        style={{
          /* Clip so the gradient mask looks clean */
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 52%, transparent 80%)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 52%, transparent 80%)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {/* Inner scroll area — same height as the real panel so layout matches */}
        <div style={{ minHeight: "520px", overflow: "hidden" }}>
          {/* Placeholder story peek that always looks good */}
          <div className="seeker-peek-shell">
            {/* Stats bar */}
            <div className="seeker-peek-stats">
              <span className="seeker-peek-stat">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <strong>—</strong> Tweets Analyzed
              </span>
              <span className="seeker-peek-stat is-green">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                <strong>—</strong> Engagement
              </span>
            </div>

            <div className="seeker-peek-divider" />

            <div className="seeker-peek-kicker">TODAY'S TOP STORY</div>
            <h2 className="seeker-peek-title">
              Solana's daily intelligence brief — curated from CT
            </h2>
            <p className="seeker-peek-byline">By AI Gossip News Desk</p>
            <p className="seeker-peek-body">
              Today's intelligence covers the dominant narratives moving the
              Solana ecosystem, ranked by on-chain signal and crypto-twitter
              engagement. Unlock to see which protocols are attracting real
              flow, which narratives have legs, and where the smart money is
              actually watching.
            </p>

            {/* Second card teaser */}
            <div className="seeker-peek-more-label">ALSO FEATURED</div>
            <div className="seeker-peek-card">
              <div className="seeker-peek-card-tag live">LIVE</div>
              <div className="seeker-peek-card-title">
                Second story waiting for unlock…
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Paywall panel (solid, pinned to bottom) ───── */}
      <div className="gossip-paywall-panel">
        {/* The gradient bridge — fades from transparent into the panel bg */}
        <div className="gossip-paywall-gradient" />

        {/* The solid card */}
        <div className="gossip-paywall-card">
          {/* Top accent rule */}
          <div className="gossip-paywall-rule" />

          <p className="gossip-paywall-overline">SEEKER INTELLIGENCE</p>
          <h2 className="gossip-paywall-headline">
            {isNoToken
              ? "Seeker Token Not Found"
              : "Read with a Seeker Token"}
          </h2>
          <p className="gossip-paywall-body">
            {isNoToken
              ? `Wallet ${publicKey?.toBase58().slice(0, 4)}…${publicKey?.toBase58().slice(-4)} doesn't hold the Genesis token. Get access to daily alpha, CT narratives, and deep positioning intel.`
              : "Unlock daily alpha, CT narrative analysis, and deep positioning intel reserved for Solana's earliest believers."}
          </p>

          <button className="gossip-paywall-cta" onClick={onConnect}>
            {isNoToken ? "Get Seeker Token  ↗" : "Connect Wallet"}
          </button>

          {isNoToken && (
            <div className="gossip-paywall-secondary-row">
              {process.env.NODE_ENV === "development" && (
                <button className="gossip-paywall-link" onClick={onBypass}>
                  Dev Bypass
                </button>
              )}
              <button className="gossip-paywall-link" onClick={onDisconnect}>
                Disconnect
              </button>
            </div>
          )}

          {!isNoToken && (
            <p className="gossip-paywall-sub">
              ALREADY HOLDING?{" "}
              <button className="gossip-paywall-link" onClick={onConnect}>
                CONNECT NOW
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main guard component ───────────────────────────────────────────── */
export default function SeekerGuard({ children }) {
  const { connection } = useConnection();
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [hasSeeker, setHasSeeker] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      if (!publicKey || !connected) {
        setHasSeeker(false);
        return;
      }
      setChecking(true);
      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        });
        const seekerToken = tokenAccounts.value.find((account) => {
          const info = account.account.data.parsed.info;
          return info.mint === SEEKER_MINT_ADDRESS && info.tokenAmount.uiAmount > 0;
        });
        setHasSeeker(!!seekerToken);
      } catch (err) {
        console.error("Error checking Seeker ownership:", err);
        setHasSeeker(false);
      } finally {
        setChecking(false);
      }
    };
    checkOwnership();
  }, [publicKey, connected, connection]);

  const handleConnect = () => setVisible(true);

  if (!connected) {
    return (
      <GossipPaywall
        variant="not-connected"
        onConnect={handleConnect}
      />
    );
  }

  if (checking) {
    return (
      <div style={{ position: "relative" }}>
        {children}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", zIndex: 50,
          background: "rgba(24, 24, 27, 0.95)",
          border: "1px solid rgba(16, 185, 129, 0.4)",
          borderRadius: "12px", padding: "16px 24px",
          backdropFilter: "blur(12px)",
        }}>
          <div style={{ color: "#10b981", fontSize: "14px" }}>Verifying…</div>
        </div>
      </div>
    );
  }

  if (!hasSeeker) {
    return (
      <GossipPaywall
        variant="no-token"
        onConnect={handleConnect}
        publicKey={publicKey}
        onDisconnect={disconnect}
        onBypass={() => setHasSeeker(true)}
      />
    );
  }

  return children;
}

"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "gossip_onboarded";

const SLIDES = [
    {
        img: "/raven-welcome.png",
        bgFrom: "#0a0514",
        bgTo: "#110a28",
        accent: "#14f195",
        overline: "WELCOME TO GOSSIP",
        headline: "I'm your guide to\nthe signal.",
        subline: "The Solana intelligence terminal. Real-time market data, AI briefings, and exclusive deep-dives — all in one place.",
        hint: null,
        quip: "SQUAIK. READY FOR THE ALPHA?",
    },
    {
        img: "/raven-market.png",
        bgFrom: "#050d0a",
        bgTo: "#071a10",
        accent: "#14f195",
        overline: "PANEL 1 — SIGNAL BOARD",
        headline: "Market pulse.\nLive, always.",
        subline: "SOL price, 7-day delta, Fear & Greed, BTC dominance, and the week's dominant CT narratives ranked by engagement.",
        hint: "Swipe left to reach it",
        quip: "THE CHARTS DON'T LIE.",
    },
    {
        img: "/raven-briefing.png",
        bgFrom: "#0a0a05",
        bgTo: "#1a1505",
        accent: "#f59e0b",
        overline: "PANEL 2 — DAILY BRIEFING",
        headline: "AI intel,\nevery morning.",
        subline: "The pipeline filters thousands of CT tweets, clusters narratives, and drafts readable intelligence reports — daily at 7am UTC.",
        hint: "Refreshes automatically",
        quip: "THE INTEL IS FRESH.",
    },
    {
        img: "/raven-seeker.png",
        bgFrom: "#05050f",
        bgTo: "#0a0520",
        accent: "#c084fc",
        overline: "PANEL 3 — SEEKER STORIES",
        headline: "Exclusive access\nunlocked.",
        subline: "Deep-dive analysis for Solana Seeker Genesis holders. Connect your wallet to verify your token and read today's full reports.",
        hint: "Seeker Genesis Token required",
        quip: "THE KEY IS YOURS.",
    },
];

export default function OnboardingCarousel() {
    const [visible, setVisible] = useState(false);
    const [slide, setSlide] = useState(0);
    const [exiting, setExiting] = useState(false);
    const [imgFade, setImgFade] = useState(true);

    useEffect(() => {
        try {
            if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
        } catch { /* ignore */ }
    }, []);

    const goTo = useCallback((idx) => {
        setImgFade(false);
        setTimeout(() => { setSlide(idx); setImgFade(true); }, 180);
    }, []);

    const dismiss = useCallback((permanent = true) => {
        setExiting(true);
        setTimeout(() => { setVisible(false); setExiting(false); }, 320);
        if (permanent) {
            try { window.localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
        }
    }, []);

    const next = useCallback(() => {
        if (slide < SLIDES.length - 1) goTo(slide + 1);
        else dismiss(true);
    }, [slide, goTo, dismiss]);

    const prev = useCallback(() => { if (slide > 0) goTo(slide - 1); }, [slide, goTo]);

    if (!visible) return null;

    const s = SLIDES[slide];
    const isLast = slide === SLIDES.length - 1;

    return (
        <div
            style={{
                position: "fixed", inset: 0, zIndex: 9999,
                background: `linear-gradient(to bottom, ${s.bgFrom}, ${s.bgTo})`,
                display: "flex", flexDirection: "column",
                opacity: exiting ? 0 : 1,
                transition: "opacity 0.32s ease, background 0.4s ease",
                overflow: "hidden",
            }}
        >
            {/* ── Top bar ───────────────────────────────────────────── */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 22px 0",
                zIndex: 2,
            }}>
                <span style={{
                    fontSize: "1.1rem", fontFamily: "JetBrains Mono, monospace",
                    fontWeight: 800, color: s.accent, letterSpacing: "0.04em",
                }}>GOSSIP</span>

                <button
                    onClick={() => dismiss(true)}
                    style={{
                        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "999px", padding: "5px 14px",
                        fontSize: "0.68rem", fontFamily: "JetBrains Mono, monospace",
                        color: "rgba(180,190,220,0.55)", letterSpacing: "0.1em",
                        cursor: "pointer", textTransform: "uppercase",
                    }}
                >Skip</button>
            </div>

            {/* ── Artwork ───────────────────────────────────────────── */}
            <div style={{
                flex: 1, position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: 0,
            }}>
                {/* Gradient bloom behind the image */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: `radial-gradient(ellipse at 50% 60%, ${s.accent}18 0%, transparent 70%)`,
                    pointerEvents: "none",
                    transition: "background 0.4s ease",
                }} />

                <img
                    src={s.img}
                    alt=""
                    style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                        opacity: imgFade ? 1 : 0,
                        transition: "opacity 0.18s ease",
                        position: "relative", zIndex: 1,
                        filter: "drop-shadow(0 16px 48px rgba(0,0,0,0.8))",
                    }}
                />

                {/* Quip badge */}
                <div style={{
                    position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)",
                    background: "rgba(12,14,24,0.85)", backdropFilter: "blur(10px)",
                    border: `1px solid ${s.accent}44`,
                    borderRadius: "999px", padding: "6px 16px",
                    display: "flex", alignItems: "center", gap: "7px",
                    opacity: imgFade ? 1 : 0, transition: "opacity 0.18s ease",
                    whiteSpace: "nowrap",
                    zIndex: 2,
                }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: s.accent, flexShrink: 0 }} />
                    <span style={{
                        fontSize: "0.6rem", fontFamily: "JetBrains Mono, monospace",
                        color: s.accent, letterSpacing: "0.12em", textTransform: "uppercase",
                    }}>{s.quip}</span>
                </div>
            </div>

            {/* ── Bottom content panel ──────────────────────────────── */}
            <div style={{
                padding: "20px 24px 32px",
                background: "linear-gradient(to bottom, transparent, rgba(5,5,15,0.98) 30%)",
                flexShrink: 0,
            }}>
                {/* Overline */}
                <p style={{
                    fontSize: "0.58rem", fontFamily: "JetBrains Mono, monospace",
                    letterSpacing: "0.15em", color: "rgba(140,155,190,0.6)",
                    textTransform: "uppercase", marginBottom: "8px",
                    opacity: imgFade ? 1 : 0, transition: "opacity 0.2s ease 0.05s",
                }}>{s.overline}</p>

                {/* Headline */}
                <h2 style={{
                    fontSize: "1.6rem", fontWeight: 800, color: "#f0f4ff",
                    lineHeight: 1.15, marginBottom: "10px",
                    letterSpacing: "-0.02em", whiteSpace: "pre-line",
                    opacity: imgFade ? 1 : 0, transition: "opacity 0.2s ease 0.07s",
                }}>{s.headline}</h2>

                {/* Subline */}
                <p style={{
                    fontSize: "0.88rem", color: "rgba(165,175,210,0.75)",
                    lineHeight: 1.6, marginBottom: s.hint ? "8px" : "20px",
                    opacity: imgFade ? 1 : 0, transition: "opacity 0.2s ease 0.1s",
                }}>{s.subline}</p>

                {/* Hint pill */}
                {s.hint && (
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        background: `${s.accent}12`, border: `1px solid ${s.accent}30`,
                        borderRadius: "999px", padding: "4px 12px", marginBottom: "18px",
                        opacity: imgFade ? 1 : 0, transition: "opacity 0.2s ease 0.12s",
                    }}>
                        <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: s.accent }} />
                        <span style={{ fontSize: "0.65rem", fontFamily: "JetBrains Mono, monospace", color: s.accent, letterSpacing: "0.07em" }}>
                            {s.hint}
                        </span>
                    </div>
                )}

                {/* Dot indicators */}
                <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "16px" }}>
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            style={{
                                width: i === slide ? "22px" : "6px",
                                height: "6px", borderRadius: "999px",
                                background: i === slide ? s.accent : "rgba(100,120,160,0.25)",
                                border: "none", cursor: "pointer", padding: 0,
                                transition: "width 0.25s ease, background 0.25s ease",
                            }}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "10px" }}>
                    {slide > 0 && (
                        <button onClick={prev} style={{
                            flex: 1, padding: "14px", borderRadius: "14px",
                            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(72,84,112,0.3)",
                            color: "rgba(165,175,210,0.7)", fontSize: "0.92rem", fontWeight: 600,
                            cursor: "pointer",
                        }}>← Back</button>
                    )}
                    <button
                        onClick={next}
                        style={{
                            flex: 2, padding: "14px", borderRadius: "14px",
                            background: isLast ? s.accent : `${s.accent}18`,
                            border: `1px solid ${isLast ? s.accent : s.accent + "44"}`,
                            color: isLast ? "#000" : s.accent,
                            fontSize: "0.95rem", fontWeight: 800,
                            cursor: "pointer", transition: "all 0.25s",
                            letterSpacing: isLast ? "0.04em" : "0",
                        }}
                    >{isLast ? "LET'S GO →" : "Next →"}</button>
                </div>
            </div>
        </div>
    );
}

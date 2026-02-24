"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "gossip_onboarded";

const SLIDES = [
    {
        img: "/cat-welcome.png",
        bg: "radial-gradient(ellipse 100% 120% at 50% 100%, #0f0820 0%, #07040f 55%, #050310 100%)",
        accent: "#14f195",
        dialogue: "You don't need to spend 12 hours a day on X to stay up to date on Solana. That's literally my job.",
    },
    {
        img: "/cat-market.png",
        bg: "radial-gradient(ellipse 100% 120% at 50% 100%, #041a0e 0%, #020d08 55%, #030a06 100%)",
        accent: "#14f195",
        dialogue: "Can't tell if that crypto email is legit? Can't tell if those airdrop instructions on X are real or a scam? We take out the guesswork.",
    },
    {
        img: "/cat-briefing.png",
        bg: "radial-gradient(ellipse 100% 120% at 50% 100%, #1a1002 0%, #0d0905 55%, #080604 100%)",
        accent: "#f59e0b",
        dialogue: "No X account. No newsletter. No sign-up. Every morning at 7am, your AI-curated Solana briefing is just... here.",
    },
    {
        img: "/cat-seeker.png",
        bg: "radial-gradient(ellipse 100% 120% at 50% 100%, #100520 0%, #060310 55%, #040210 100%)",
        accent: "#c084fc",
        dialogue: "Seeker Genesis holders unlock the deep-dive reports — the analytical stuff CT won't break down for you. Tap to verify your wallet.",
    },
];

export default function OnboardingCarousel() {
    const [visible, setVisible] = useState(false);
    const [slide, setSlide] = useState(0);
    const [catFade, setCatFade] = useState(true);
    const [textFade, setTextFade] = useState(true);
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        try {
            if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
        } catch { /* ignore */ }
    }, []);

    const goTo = useCallback((idx) => {
        setCatFade(false);
        setTextFade(false);
        setTimeout(() => {
            setSlide(idx);
            setCatFade(true);
            setTimeout(() => setTextFade(true), 80);
        }, 200);
    }, []);

    const dismiss = useCallback((permanent = true) => {
        setExiting(true);
        setTimeout(() => setVisible(false), 350);
        if (permanent) {
            try { window.localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
        }
    }, []);

    const next = useCallback(() => {
        if (slide < SLIDES.length - 1) goTo(slide + 1);
        else dismiss(true);
    }, [slide, goTo, dismiss]);

    if (!visible) return null;

    const s = SLIDES[slide];
    const isLast = slide === SLIDES.length - 1;

    return (
        <div
            style={{
                position: "fixed", inset: 0, zIndex: 9999,
                background: s.bg,
                transition: "background 0.5s ease, opacity 0.35s ease",
                opacity: exiting ? 0 : 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "hidden",
            }}
        >
            {/* ── Star/noise texture ─────────────────────────────── */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
            }} />

            {/* ── Skip button ────────────────────────────────────── */}
            <button
                onClick={() => dismiss(true)}
                style={{
                    position: "absolute", top: 20, right: 20, zIndex: 10,
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "999px", padding: "6px 16px",
                    fontSize: "0.65rem", fontFamily: "JetBrains Mono, monospace",
                    color: "rgba(180,190,220,0.5)", letterSpacing: "0.1em",
                    cursor: "pointer", textTransform: "uppercase",
                }}
            >Skip</button>

            {/* ── Gossip Cat — fills upper portion ───────────────── */}
            <div style={{
                flex: 1,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                width: "100%",
                minHeight: 0,
                position: "relative",
            }}>
                {/* Accent glow under cat feet */}
                <div style={{
                    position: "absolute",
                    bottom: 0, left: "50%",
                    transform: "translateX(-50%)",
                    width: "280px", height: "80px",
                    borderRadius: "50%",
                    background: `radial-gradient(ellipse, ${s.accent}22 0%, transparent 70%)`,
                    filter: "blur(20px)",
                    transition: "background 0.5s ease",
                    pointerEvents: "none",
                }} />

                <img
                    key={s.img}
                    src={s.img}
                    alt="Gossip Cat"
                    style={{
                        height: "min(65vh, 500px)",
                        width: "auto",
                        objectFit: "contain",
                        objectPosition: "bottom",
                        opacity: catFade ? 1 : 0,
                        transform: catFade ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
                        transition: "opacity 0.22s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                        mixBlendMode: "screen",
                        filter: `drop-shadow(0 0 40px ${s.accent}33)`,
                        position: "relative", zIndex: 2,
                    }}
                />
            </div>

            {/* ── Dialogue box ───────────────────────────────────── */}
            <div style={{
                width: "100%",
                maxWidth: "540px",
                padding: "0 16px 32px",
                flexShrink: 0,
            }}>
                <div style={{
                    background: "rgba(8, 10, 20, 0.88)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: `1px solid ${s.accent}33`,
                    borderRadius: "20px",
                    padding: "20px 22px 22px",
                    boxShadow: `0 0 40px rgba(0,0,0,0.5), inset 0 1px 0 ${s.accent}18`,
                    transition: "border-color 0.5s ease",
                }}>
                    {/* Speaker label */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        marginBottom: "10px",
                    }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.accent, flexShrink: 0 }} />
                        <span style={{
                            fontSize: "0.6rem", fontFamily: "JetBrains Mono, monospace",
                            color: s.accent, letterSpacing: "0.14em", textTransform: "uppercase",
                            fontWeight: 700,
                        }}>GOSSIP CAT</span>
                    </div>

                    {/* Dialogue text */}
                    <p style={{
                        fontSize: "1rem", lineHeight: 1.65,
                        color: "rgba(230, 235, 255, 0.92)",
                        marginBottom: "18px",
                        fontWeight: 400,
                        opacity: textFade ? 1 : 0,
                        transform: textFade ? "translateY(0)" : "translateY(6px)",
                        transition: "opacity 0.2s ease, transform 0.2s ease",
                        minHeight: "4.9rem",
                    }}>{s.dialogue}</p>

                    {/* Dots + buttons */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {/* Dot indicators */}
                        <div style={{ display: "flex", gap: "5px", flex: 1 }}>
                            {SLIDES.map((_, i) => (
                                <button key={i} onClick={() => goTo(i)} style={{
                                    width: i === slide ? "18px" : "5px", height: "5px",
                                    borderRadius: "999px",
                                    background: i === slide ? s.accent : "rgba(100,120,160,0.2)",
                                    border: "none", cursor: "pointer", padding: 0,
                                    transition: "width 0.22s ease, background 0.3s ease",
                                }} />
                            ))}
                        </div>

                        {/* Back */}
                        {slide > 0 && (
                            <button onClick={() => goTo(slide - 1)} style={{
                                padding: "10px 16px", borderRadius: "12px",
                                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(80,95,130,0.25)",
                                color: "rgba(160,172,210,0.65)", fontSize: "0.85rem", fontWeight: 600,
                                cursor: "pointer",
                            }}>←</button>
                        )}

                        {/* Next / Let's go */}
                        <button onClick={next} style={{
                            padding: "10px 22px", borderRadius: "12px",
                            background: isLast ? s.accent : `${s.accent}18`,
                            border: `1px solid ${isLast ? s.accent : s.accent + "44"}`,
                            color: isLast ? "#000" : s.accent,
                            fontSize: "0.88rem", fontWeight: 700, cursor: "pointer",
                            transition: "all 0.25s",
                            letterSpacing: isLast ? "0.04em" : "0",
                        }}>{isLast ? "Let's go 🐾" : "Next →"}</button>
                    </div>

                    {/* Don't show again */}
                    <button onClick={() => dismiss(true)} style={{
                        display: "block", width: "100%", marginTop: "12px",
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: "0.62rem", fontFamily: "JetBrains Mono, monospace",
                        color: "rgba(100,115,155,0.4)", letterSpacing: "0.08em",
                        textAlign: "center", padding: "2px",
                    }}>DON'T SHOW AGAIN</button>
                </div>
            </div>
        </div>
    );
}

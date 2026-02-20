"use client";

/**
 * AppWalletProvider
 * 
 * Configures the Solana Wallet Adapter for the application.
 * 
 * ARCHITECTURE NOTE:
 * This app is wrapped in Capacitor for Android. The Mobile Wallet Adapter (MWA)
 * protocol relies on Android Intents which cannot be triggered directly from
 * a Capacitor WebView without a native plugin bridge.
 * 
 * For this reason, we explicitly support Phantom and Solflare standard adapters
 * which function correctly via deep linking/universal links in this environment.
 */

import React, { useMemo, useEffect, useState } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { SolanaMobileWalletAdapter, createDefaultAddressSelector, createDefaultAuthorizationResultCache, createDefaultWalletNotFoundHandler } from "@solana-mobile/wallet-adapter-mobile";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { Capacitor } from "@capacitor/core";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

export default function AppWalletProvider({ children }) {
    const network = WalletAdapterNetwork.Mainnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const [wallets, setWallets] = useState<any[]>([]);

    useEffect(() => {
        const setupWallets = async () => {
            const baseWallets = [
                new PhantomWalletAdapter(),
                new SolflareWalletAdapter()
            ];

            if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
                // We are natively on Android (Seeker), use the official Mobile Wallet Adapter
                // This triggers the native Android intents for the Seed Vault
                setWallets([
                    new SolanaMobileWalletAdapter({
                        addressSelector: createDefaultAddressSelector(),
                        appIdentity: {
                            name: "Validator Intelligence",
                            uri: "https://validator-solana-intelligence.vercel.app",
                            icon: "https://validator-solana-intelligence.vercel.app/icon.png",
                        },
                        authorizationResultCache: createDefaultAuthorizationResultCache(),
                        cluster: WalletAdapterNetwork.Mainnet,
                        onWalletNotFound: createDefaultWalletNotFoundHandler(),
                    }),
                    ...baseWallets
                ]);
            } else {
                // We are in the web browser preview
                setWallets(baseWallets);
            }
        };

        setupWallets();
    }, []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

"use client";
import { Suspense } from 'react';
import React, { useState, useEffect } from "react";
import type { Wallet as ParaWallet } from "@getpara/web-sdk";
import { useRouter, useSearchParams } from 'next/navigation';
import para from '../utils/para';
import { useModal } from "../context/ModalContext";

// Component con chứa logic chính
function HomePageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [wallet, setWallet] = useState<ParaWallet | null>(null);
    const { isModalOpen, setIsModalOpen } = useModal();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const modalState = localStorage.getItem("isModalOpen");
            if (modalState === "true") {
                setIsModalOpen(true);
            }
        }
    }, [setIsModalOpen]);

    const handleLoginSuccess = async (wallet: ParaWallet) => {
        try {
            const paraWallets = para.getWallets();
            const firstWallet = Object.values(paraWallets)[0];
            if (firstWallet) {
                setWallet(firstWallet);
                setIsModalOpen(false);

                const params = new URLSearchParams({
                    address: firstWallet.address || '',
                    type: firstWallet.type || '',
                    id: firstWallet.id || ''
                }).toString();

                await router.push(`/dashbroad?${params}`);
                localStorage.setItem("isModalOpen", "false");
            }
        } catch (error) {
            console.error("Error getting wallets:", error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
        if (typeof window !== 'undefined') {
            try {
                const paraWallets = para.getWallets();
                const firstWallet = Object.values(paraWallets)[0];
                if (firstWallet) {
                    handleLoginSuccess(firstWallet);
                }
            } catch (error) {
                console.error("Error in openModal:", error);
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-custom">
            <div className="text-center p-8 w-[720px] space-y-8">
                <div className="avatar-container">
                    <img
                        src="https://assets.cdn.filesafe.space/C4PQXa1OiDoBLHzyyKjQ/media/6686d864a52ad850036852ab.png"
                        alt="User Avatar"
                        className="avatar-image"
                    />
                    <span className="status-badge">
                        {wallet ? 'Online' : 'Offline'}
                    </span>
                </div>

                <div className="container glass-card text-foreground">
                    <h1 className="text-4xl font-bold mb-4">Trade Wizard</h1>
                    <p>Connect your wallet to start your journey!</p>
                    <button
                        type="button"
                        className="wallet-button flex items-center justify-center space-x-2 mx-auto"
                        onClick={openModal}
                    >
                        Open Para Wallet
                    </button>
                </div>
            </div>
        </div>
    );
}

// Component cha với Suspense
export default function HomePage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="glass-card p-6">
                        <p className="text-white">Loading...</p>
                    </div>
                </div>
            }
        >
            <HomePageContent />
        </Suspense>
    );
}
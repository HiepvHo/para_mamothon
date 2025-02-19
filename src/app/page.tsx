"use client";  // Bắt buộc để sử dụng useState và useEffect trong App Router
import React, { useState, useEffect } from "react";
import Para, { OAuthMethod, Environment } from "@getpara/web-sdk";
import type { Wallet as ParaWallet } from "@getpara/web-sdk";  // Add this import
import { ParaModal } from "@getpara/react-sdk";
import type { ParaModalProps } from "@getpara/react-sdk";
import { useRouter } from 'next/navigation';

// Lấy API_KEY từ biến môi trường
const API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY;
const test_win = typeof window !== 'undefined' ? window.location.origin : '';

const para = new Para(Environment.BETA, API_KEY);

export default function HomePage() {
    const router = useRouter();
    const [wallet, setWallet] = useState<ParaWallet | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLoginSuccess = async (wallet: ParaWallet) => {
        try {
            const paraWallets = para.getWallets();
            const firstWallet = Object.values(paraWallets)[0];
            if (firstWallet) {
                setWallet(firstWallet); // Save wallet info to state
                setIsModalOpen(false); // Close modal after success

                // Construct URL with wallet info
                const params = new URLSearchParams({
                    address: firstWallet.address || '',
                    type: firstWallet.type || '',
                    id: firstWallet.id || ''
                }).toString();

                // Navigate to dashboard with wallet params
                await router.push(`/dashbroad?${params}`);
            }
        } catch (error) {
            console.error("Error getting wallets:", error);
        }
    };

    const modalProps: ParaModalProps = {
        para,
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        logo: "",
        theme: {},
        oAuthMethods: [
            OAuthMethod.GOOGLE,
            OAuthMethod.TWITTER,
            OAuthMethod.DISCORD,
            OAuthMethod.TELEGRAM
        ],
        authLayout: ["AUTH:FULL", "EXTERNAL:FULL"],
        recoverySecretStepEnabled: true,
        onRampTestMode: true,
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-custom">
            <div className="text-center p-8 w-[720px] space-y-8">
                {/* User Avatar */}
                <div className="avatar-container">
                    <img
                        src="https://assets.cdn.filesafe.space/C4PQXa1OiDoBLHzyyKjQ/media/6686d864a52ad850036852ab.png"
                        alt="User Avatar"
                        className="avatar-image"
                    />
                    <span className="status-badge">
                        Online
                    </span>
                </div>

                {/* Header and Description */}


                <div className="container glass-card text-foreground">
                    {/* <img src="/path/to/avatar.png" alt="User Avatar" className="mx-auto mb-4 rounded-full w-32 h-32" /> */}
                    <h1 className="text-4xl font-bold mb-4">Trade Wizard</h1>
                    <p>Connect your wallet to start your journey!</p>
                    <button
                        type="button"
                        className="wallet-button flex items-center justify-center space-x-2 mx-auto"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Open Para Wallet
                    </button>
                </div>

                {wallet && (
                    <div className="container glass-card text-foreground p-6">
                        <h2 className="text-2xl font-bold mb-4">Wallet Information</h2>
                        <div className="text-left space-y-2">
                            <p><span className="font-semibold">Wallet ID:</span> {wallet.id}</p>
                            <p><span className="font-semibold">Address:</span> {wallet.address}</p>
                            <p><span className="font-semibold">Type:</span> {wallet.type}</p>
                            {/* <p><span className="font-semibold">Chain:</span> {wallet.chain}</p> */}
                        </div>
                    </div>
                )}

                {/* Para Wallet Modal */}
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="fixed inset-0 backdrop-blur-md bg-black/50 transition-opacity duration-300">
                            <div className="relative h-full flex items-center justify-center p-4">
                                {/* Para Wallet Modal */}
                                {isModalOpen && (
                                    <div className="modal-overlay">
                                        <div className="">
                                            <div className="para-modal-wrapper">
                                                <div className="para-modal-container card-container">
                                                    <ParaModal {...modalProps}
                                                        onClose={() => {
                                                            // Kiểm tra thông qua getAccount để xác định trạng thái ví đã được xác thực chưa
                                                            try {
                                                                const wallets = para.getWallets();
                                                                const firstWallet = Object.values(wallets)[0];
                                                                if (firstWallet) {
                                                                    handleLoginSuccess(firstWallet);
                                                                }
                                                            } catch (error) {
                                                                console.error("Error during login check:", error);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

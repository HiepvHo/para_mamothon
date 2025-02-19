"use client";  // Bắt buộc để sử dụng useState và useEffect trong App Router
import React, { useState, useEffect } from "react";
import Para, { OAuthMethod, Environment } from "@getpara/web-sdk";
import { ParaModal } from "@getpara/react-sdk";


// Lấy API_KEY từ biến môi trường
const API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY;
const test_win = typeof window !== 'undefined' ? window.location.origin : '';

const para = new Para(Environment.BETA, API_KEY);

export default function HomePage() {
    const [wallet, setWallet] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const createWallet = async () => {
        try {
            const res = await fetch('/api/createWallet'); // Gọi API tạo ví
            const data = await res.json();
            setWallet(data.walletId); // Lưu walletId
        } catch (error) {
            console.error('Error creating wallet:', error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg w-96">
                {/* User Avatar */}
                <div className="mb-6">
                    <img
                        src="https://via.placeholder.com/150" // Replace with your image URL
                        alt="User Avatar"
                        className="mx-auto mb-4 rounded-full border-4 border-gray-300 p-2"
                    />
                </div>

                {/* Header and Description */}
                <h1 className="text-2xl font-semibold text-gray-700">Para Hello World</h1>
                <p className="text-gray-600 mt-4">Connect your wallet to start your journey!</p>
                {/* Action Buttons */}

                <button
                    type="button"
                    className="mt-6 py-2 px-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                    onClick={() => setIsModalOpen(true)}
                >
                    Open Para Wallet
                </button>


                {/* Para Wallet Modal */}
                <ParaModal
                    para={para}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    logo="" // You can add a logo here if needed
                    theme={{
                        foregroundColor: "#ffffff",
                        backgroundColor: "#ffffff",
                        accentColor: "#d1bfbf",
                    }}
                    oAuthMethods={[OAuthMethod.GOOGLE, OAuthMethod.TWITTER, OAuthMethod.DISCORD, OAuthMethod.TELEGRAM]}
                    authLayout={["AUTH:FULL", "EXTERNAL:FULL"]}
                    recoverySecretStepEnabled={true}
                    onRampTestMode={true}
                />
            </div>
        </div>
    );
}

"use client";  // Bắt buộc để sử dụng useState và useEffect trong App Router
import React, { useState, useEffect } from "react";
import Para, { OAuthMethod, Environment } from "@getpara/web-sdk";
import { ParaModal } from "@getpara/react-sdk";

// Lấy API_KEY từ biến môi trường
const API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY;

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
        <div className="p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Para Mini-App</h1>

            {/* Nút tạo ví
            <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={createWallet}
            >
                Create Wallet
            </button> */}

            {/* Hiển thị thông tin ví */}
            {wallet && (
                <div>
                    <h3>Your Wallet ID: {wallet}</h3>
                </div>
            )}

            {/* Nút mở Para Wallet Modal */}
            <button
                type="button"
                className="px-4 py-2 bg-green-600 text-white rounded mt-4"
                onClick={() => setIsModalOpen(true)}
            >
                Open Para Wallet
            </button>

            {/* Para Wallet Modal */}
            <ParaModal
                para={para}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                logo=""
                theme={{
                    foregroundColor: "#040400",
                    backgroundColor: "#ffffff",
                    accentColor: "#d1bfbf"
                }}
                oAuthMethods={[OAuthMethod.GOOGLE, OAuthMethod.TWITTER, OAuthMethod.DISCORD, OAuthMethod.TELEGRAM]}
                authLayout={["AUTH:FULL", "EXTERNAL:FULL"]}
                recoverySecretStepEnabled={true}
                onRampTestMode={true}
            />
        </div>
    );
}

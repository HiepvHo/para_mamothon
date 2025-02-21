"use client";
import { Suspense } from 'react';
import { FaHome, FaTrophy, FaWallet, FaTasks, FaUserPlus } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Wallet as ParaWallet } from "@getpara/web-sdk";
import Para, { OAuthMethod, Environment } from "@getpara/web-sdk";
import { ParaModal } from "@getpara/react-sdk";
import type { ParaModalProps } from "@getpara/react-sdk";
import "../styles/dashbroad.css";
import { useRouter } from 'next/navigation';
import para from '../utils/para';
import { modalProps } from '../utils/modalProps';

// import { useWallet } from "../contexts/WalletContext";

interface ExtendedParaWallet extends ParaWallet {
    chain?: string;
}


export default function Dashboard() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const searchParams = useSearchParams();
    const [walletInfo, setWalletInfo] = useState<ExtendedParaWallet | null>(null);


    useEffect(() => {
        // Get wallet info from URL params
        if (!searchParams) return;
        const address = searchParams.get("address");
        const type = searchParams.get("type");
        const id = searchParams.get("id");
        const chain = searchParams.get("chain");

        const modalState = localStorage.getItem('isModalOpen');
        if (modalState === 'true') {
            setIsModalOpen(true);
        }

        if (address && type) {
            setWalletInfo({
                id: id || "",
                address,
                type,
                chain: chain || "",
                signer: "",
            } as ParaWallet);
        }
    }, [searchParams]);

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

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleLoginSuccess = async (wallet: ParaWallet) => {
        try {
            const paraWallets = para.getWallets();
            const firstWallet = Object.values(paraWallets)[0];
            if (firstWallet) {
                setWalletInfo(firstWallet); // Save wallet info to state
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

    // Define modalProps

    const navigateToTaskPage = () => {
        if (walletInfo) {
            const { address, type, id, chain } = walletInfo;
            // Điều hướng đến taskpage với các tham số URL, bao gồm walletId
            router.push(`/taskpage?address=${address}&type=${type}&id=${id}&chain=${chain}`);
        }
    };

    const navigateToLeaders = () => {
        router.push('/leaders');
    };

    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="glass-card p-6">
                    <p className="text-white">Loading...</p>
                </div>
            </div>
        }>
            <div className="dashboard-container">
                {/* Avatar Section (Header) */}
                <div className='header_container'>
                    <div className="avatar-container">
                        <img
                            src="https://assets.cdn.filesafe.space/C4PQXa1OiDoBLHzyyKjQ/media/6686d864a52ad850036852ab.png"
                            alt="User Avatar"
                            className="avatar-image"
                        />
                        <span className="status-badge">Online</span>
                    </div>
                </div>

                {/* Wallet Information Section (Center) */}
                <div className="wallet-info-container">
                    {walletInfo && (
                        <div className="glass-card p-6">
                            <h2 className="text-2xl font-bold text-center mb-4">Wallet Information</h2>
                            <div className="text-left space-y-4">
                                <div className="glass-card-inner p-4 rounded-lg">
                                    <p>
                                        <span className="font-semibold">Wallet ID:</span>
                                        <span className="wallet-info-field ml-2 break-all">{walletInfo.id}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Navigation */}
                <div className="bottom-navbar">
                    <button type="button" className="navbar-button" onClick={openModal}>
                        <FaHome size={20} className="button-icon" />
                        <span>Home</span>
                    </button>
                    <button type="button" className="navbar-button" onClick={navigateToLeaders}>
                        <FaTrophy size={20} className="button-icon" />
                        <span>Leaders</span>
                    </button>
                    <button type="button" className="navbar-button" >
                        <FaWallet size={20} className="button-icon" />
                        <span>Earn</span>
                    </button>
                    {/* {isModalOpen &&
                    // <ParaModal {...updatedModalProps} />
                } */}
                    <button type="button" className="navbar-button" onClick={navigateToTaskPage}>
                        <FaTasks size={20} className="button-icon" />
                        <span>Tasks</span>
                    </button>
                    <button type="button" className="navbar-button">
                        <FaUserPlus size={20} className="button-icon" />
                        <span>Invites</span>
                    </button>
                </div>


            </div>

        </Suspense>
    );
}

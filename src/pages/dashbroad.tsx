"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Wallet as ParaWallet } from "@getpara/web-sdk";

interface ExtendedParaWallet extends ParaWallet {
    chain?: string;
}

export default function Dashboard() {
    const searchParams = useSearchParams();
    const [walletInfo, setWalletInfo] = useState<ExtendedParaWallet | null>(null);

    useEffect(() => {
        // Get wallet info from URL params
        if (!searchParams) return;
        const address = searchParams.get('address');
        const type = searchParams.get('type');
        const id = searchParams.get('id');
        const chain = searchParams.get('chain');

        if (address && type) {
            setWalletInfo({
                id: id || '',
                address,
                type,
                chain: chain || '',
                signer: ''
            } as ParaWallet);
        }
    }, [searchParams]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-custom">
            <div className="container mx-auto max-w-4xl">
                <div className="glass-card text-white p-8">
                    <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

                    {walletInfo && (
                        <div className="container glass-card text-foreground p-6">
                            <h2 className="text-2xl font-bold mb-4">Wallet Information</h2>
                            <div className="text-left space-y-2">
                                <p><span className="font-semibold">Wallet ID:</span> {walletInfo.id}</p>
                                <p><span className="font-semibold">Address:</span> {walletInfo.address}</p>
                                <p><span className="font-semibold">Type:</span> {walletInfo.type}</p>
                                {walletInfo.chain && (
                                    <p><span className="font-semibold">Chain:</span> {walletInfo.chain}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
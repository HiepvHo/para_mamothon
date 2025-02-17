"use client"; // Bắt buộc để dùng useState & useEffect trong App Router

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import './globals.css';

export default function ClaimPage() {
  const searchParams = useSearchParams();
  const wallet_id = searchParams?.get("wallet_id");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (wallet_id) {
      claimWallet(wallet_id);
    }
  }, [wallet_id]);

  const claimWallet = async (wallet_id: string) => {
    try {
      const response = await fetch(`/api/claim?wallet_id=${wallet_id}`);
      const data = await response.json();
      setStatus(data.message || "Error claiming wallet");
    } catch (error) {
      setStatus("Failed to claim wallet");
    }
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">Claim Your Wallet</h1>
      {status ? <p className="text-green-500">{status}</p> : <p>Claiming your wallet...</p>}
    </div>
  );
}

// "use client";
// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import Para, { Environment, Wallet } from "@getpara/web-sdk";
// import { ParaProvider, ParaModal, OAuthMethod } from "@getpara/react-sdk";
// import './globals.css';

// const API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY; // APIKEY từ env
// const para = new Para(Environment.PRODUCTION, API_KEY);

// export default function CombinedPage() {
//   const searchParams = useSearchParams();
//   const wallet_id = searchParams.get("wallet_id");
//   const [status, setStatus] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [wallet, setWallet] = useState<Wallet | null>(null);

//   useEffect(() => {
//     if (wallet_id) {
//       claimWallet(wallet_id);
//     }
//   }, [wallet_id]);

//   const claimWallet = async (wallet_id: string) => {
//     try {
//       const response = await fetch(`/api/claim?wallet_id=${wallet_id}`);
//       const data = await response.json();
//       setStatus(data.message || "Error claiming wallet");
//     } catch (error) {
//       setStatus("Failed to claim wallet");
//     }
//   };

//   const createWallet = async () => {
//     try {
//       const [newWallet] = await para.createWallet();
//       setWallet(newWallet);
//     } catch (error) {
//       console.error("Error creating wallet:", error);
//     }
//   };

//   return (
//     <div className="p-6 text-center">
//       <h1 className="text-3xl font-bold mb-4">Welcome to Para Mini-App</h1>

//       {/* Tạo ví */}
//       {!wallet && (
//         <>
//           <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={createWallet}>
//             Create Wallet
//           </button>
//         </>
//       )}

//       {/* Hiển thị thông tin ví nếu đã tạo */}
//       {wallet && (
//         <div>
//           <h3>Your Wallet ID: {wallet.id}</h3>
//           <a href={`/claim?wallet_id=${wallet.id}`} className="text-blue-500">
//             Claim your wallet
//           </a>
//         </div>
//       )}

//       {/* Hiển thị trạng thái claim ví nếu có wallet_id */}
//       {wallet_id && (
//         <div>
//           <h2 className="text-2xl font-bold">Claim Your Wallet</h2>
//           {status ? <p className="text-green-500">{status}</p> : <p>Claiming your wallet...</p>}
//         </div>
//       )}

//       {/* Mở Modal */}
//       <button className="px-4 py-2 bg-green-600 text-white rounded mt-4" onClick={() => setIsModalOpen(true)}>
//         Open Para Wallet
//       </button>

//       <ParaModal
//         para={para}
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         logo="https://para-wallet.com/claim"
//         theme={{}}
//         oAuthMethods={[OAuthMethod.GOOGLE, OAuthMethod.FARCASTER]}
//         authLayout={["AUTH:FULL", "EXTERNAL:FULL"]}
//         externalWallets={["METAMASK", "PHANTOM"]}
//         recoverySecretStepEnabled
//       />
//     </div>
//   );
// }
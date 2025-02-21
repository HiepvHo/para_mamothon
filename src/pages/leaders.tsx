"use client";
import { Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaHome, FaTrophy, FaWallet, FaTasks, FaUserPlus } from 'react-icons/fa';
import para from '../utils/para';
import type { Wallet as ParaWallet } from "@getpara/web-sdk";
import "../styles/dashbroad.css";


interface Leader {
  address: string;
  points: number;
}

interface WalletInfo {
  address: string;
  type: string;
  id: string;
  chain?: string;
}

const LeadersPage = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [points, setPoints] = useState<number | null>(null);


  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await fetch("/api/leaderboard"); // Đảm bảo gọi đúng endpoint

        // Kiểm tra mã trạng thái HTTP
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setLeaders(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(`Error fetching leaders: ${error.message}`);
        } else {
          setError("An unknown error occurred while fetching data.");
        }
        console.error("Error fetching leaders:", error);
      }
    };

    fetchLeaders();
  }, []);

  useEffect(() => {
    if (!searchParams) return;

    const address = searchParams.get("address");
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    const chain = searchParams.get("chain");

    if (address) {
      setUsername(address);
    }

    if (address && type) {
      setWalletInfo({
        id: id || "",
        address,
        type,
        chain: chain || "",
      });
    }

    if (address) {
      fetch(`/api/task?address=${address}`)
        .then((response) => response.json())
        .then((data) => setPoints(data.points || 0))
        .catch((error) => console.error("Error fetching points:", error));
    }
  }, [searchParams]);

  const navigateToTaskPage = async () => {
    try {
      const paraWallets = para.getWallets();
      const firstWallet = Object.values(paraWallets)[0];
      if (firstWallet) {
        setWalletInfo({
          id: firstWallet.id || "",
          address: firstWallet.address || "",
          type: firstWallet.type || ""
        }); // Save wallet info to state
        setIsModalOpen(false); // Close modal after success

        // Construct URL with wallet info
        const params = new URLSearchParams({
          address: firstWallet.address || '',
          type: firstWallet.type || '',
          id: firstWallet.id || ''
        }).toString();

        // Navigate to dashboard with wallet params
        await router.push(`/taskpage?${params}`);
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

  const navigateToLeaders = () => {
    router.push('/leaders');
  };

  const handleLoginSuccess = async (wallet: ParaWallet) => {
    try {
      const paraWallets = para.getWallets();
      const firstWallet = Object.values(paraWallets)[0];
      if (firstWallet) {
        setWalletInfo({
          id: firstWallet.id || "",
          address: firstWallet.address || "",
          type: firstWallet.type || ""
        }); // Save wallet info to state
        setIsModalOpen(false); // Close modal after success
        localStorage.setItem('isModalOpen', 'true');

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
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass-card p-6">
          <p className="text-white">Loading...</p>
        </div>
      </div>
    }>
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Leaderboard</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Wallet Address</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader, index) => (
                <tr key={leader.address}>
                  <td>{index + 1}</td>
                  <td>{leader.address}</td>
                  <td>{leader.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
};

export default LeadersPage;

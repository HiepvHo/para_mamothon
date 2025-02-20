"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ExtendedParaWallet {
  id: string;
  address: string;
  type: string;
  chain?: string;
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [walletInfo, setWalletInfo] = useState<ExtendedParaWallet | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);

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

  const handleTaskComplete = async () => {
    const address = walletInfo?.address;

    if (address) {
      try {
        const response = await fetch("/api/task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, taskId: "facebook-task" }),
        });

        const data = await response.json();
        setPoints(data.points); // Cập nhật lại điểm sau khi thực hiện nhiệm vụ
      } catch (error) {
        console.error("Error completing task:", error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-custom">
      <div className="container mx-auto max-w-4xl p-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {walletInfo && (
          <div className="glass-card text-foreground p-6">
            <h2 className="text-2xl font-bold mb-4">Wallet Information</h2>
            <div className="text-left space-y-2">
              <p>
                <span className="font-semibold">Wallet ID:</span> {walletInfo.id}
              </p>
              <p>
                <span className="font-semibold">Address:</span> {walletInfo.address}
              </p>
              <p>
                <span className="font-semibold">Type:</span> {walletInfo.type}
              </p>
              {walletInfo.chain && (
                <p>
                  <span className="font-semibold">Chain:</span> {walletInfo.chain}
                </p>
              )}
            </div>
          </div>
        )}

        {points !== null && (
          <div className="glass-card text-foreground p-6">
            <h2 className="text-2xl font-bold mb-4">Points Information</h2>
            <p className="text-lg">Points: {points}</p>
          </div>
        )}

        {username && (
          <div className="glass-card text-foreground p-6">
            <h2 className="text-2xl font-bold mb-4">User Information</h2>
            <p className="text-lg">
              <span className="font-semibold">Username (Wallet Address):</span> {username}
            </p>
          </div>
        )}

        {/* Button to trigger the task */}
        <div className="mt-4">
          <button
            onClick={handleTaskComplete}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Test Nhiệm Vụ
          </button>
        </div>
      </div>
    </div>
  );
}

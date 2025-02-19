"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// Loading component
function LoadingFallback() {
  return (
    <div className="p-6 text-center">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
      </div>
    </div>
  );
}

// Claim content component
function ClaimContent() {
  const searchParams = useSearchParams();
  const wallet_id = searchParams?.get("wallet_id");
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (wallet_id) {
      claimWallet(wallet_id);
    } else {
      setIsLoading(false);
    }
  }, [wallet_id]);

  const claimWallet = async (wallet_id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/claim?wallet_id=${wallet_id}`);
      const data = await response.json();
      setStatus(data.message || "Error claiming wallet");
    } catch (error) {
      setStatus("Failed to claim wallet");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Claim Your Wallet</h1>
      {status && (
        <p className={`mt-4 ${status.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {status}
        </p>
      )}
    </div>
  );
}

// Main page component
export default function ClaimPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ClaimContent />
    </Suspense>
  );
}
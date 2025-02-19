import { Para, Environment, WalletType } from '@getpara/server-sdk'; // Correct import for Para SDK
import { walletConnectWallet } from '@getpara/evm-wallet-connectors';
import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const para = new Para(Environment.PRODUCTION, API_KEY); // Initialize Para with API key

    // Setup the wallet connector
    const connector = walletConnectWallet({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string, // Project ID for WalletConnect
    });

    // Connect to the wallet using the connector
    // const connectedWallet = await connector.connect(); // This returns the connected wallet object
    // console.log('Wallet connected:', connectedWallet);

    // Optionally create a new wallet of type EVM (only if needed)
    const [newWallet] = await para.createWallet({ type: WalletType.EVM });
    res.status(200).json({ walletId: newWallet.id });
  } catch (error) {
    console.error("Error connecting wallet:", error);
    res.status(500).json({ error: 'Error connecting wallet' });
  }
}

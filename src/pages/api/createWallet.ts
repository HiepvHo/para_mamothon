import { Para, Environment, WalletType } from '@getpara/server-sdk'; // Import from server-sdk
import type { NextApiRequest, NextApiResponse } from 'next';

// Lấy API_KEY từ biến môi trường
const API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY;
console.log(API_KEY);
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Check if the API key is defined
        if (!API_KEY) {
            throw new Error('API key is missing');
        }

        const para = new Para(Environment.BETA, API_KEY); // Khởi tạo para với server-sdk

        // Specify the wallet type (adjust the type if needed)
        const [wallet] = await para.createWallet({ type: WalletType.EVM });  // Tạo ví mới

        res.status(200).json({ walletId: wallet.id });
    } catch (error) {
        // Log the error for debugging
        console.error('Error occurred while creating wallet:', error);

        // Respond with a 500 status code and error message
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error creating wallet' });
    }
}

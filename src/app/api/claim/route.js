// src/app/api/claim/route.js

export async function POST(req) {
  const { wallet_id } = await req.json();
  
  // Kiểm tra xem wallet_id có được cung cấp không
  if (!wallet_id) {
    return new Response(JSON.stringify({ message: "Wallet ID is required" }), { status: 400 });
  }

  const API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY;  // Lấy API_KEY từ biến môi trường
  
  try {
    // Gửi yêu cầu tới API bên ngoài để claim wallet
    const response = await fetch(`https://api.getpara.com/v1/wallet/${wallet_id}/claim`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"  // Đảm bảo là gửi đúng kiểu Content-Type
      },
    });

    // Kiểm tra phản hồi từ API bên ngoài
    if (response.ok) {
      return new Response(JSON.stringify({ message: "Wallet claimed successfully!" }), { status: 200 });
    }
    return new Response(JSON.stringify({ message: "Error claiming wallet" }), { status: 500 });
  } catch (error) {
    // Bắt lỗi nếu có vấn đề khi gửi yêu cầu
    return new Response(JSON.stringify({ message: "Error claiming wallet" }), { status: 500 });
  }
}
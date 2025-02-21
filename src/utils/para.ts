import Para, { Environment } from "@getpara/web-sdk";

// Initialize the Para instance once
const API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY;
const para = new Para(Environment.BETA, API_KEY);

export default para;

"use client";
import { Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Wallet as ParaWallet } from "@getpara/web-sdk";
import { FaHome, FaTrophy, FaWallet, FaTasks, FaUserPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import "../styles/dashbroad.css";
import para from '../utils/para';




interface ExtendedParaWallet {
    id: string;
    address: string;
    type: string;
    chain?: string;
}

export default function TaskPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [walletInfo, setWalletInfo] = useState<ExtendedParaWallet | null>(null);
    const [points, setPoints] = useState<number | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [tasks, setTasks] = useState([
        {
            id: "task1",
            status: "Go",
            url: "https://www.youtube.com/watch?v=_-6YJIZF4uY&feature=youtu.be",
            name: "Watch video and earn", // Task name
            description: "Watch the video to earn rewards",
            points: "20"
        },
        {
            id: "task2",
            status: "Go",
            url: "https://docs.getpara.com/welcome",
            name: "Read the documentation", // Task name
            description: "Read the official documentation to learn more",
            points: "20"
        },
        {
            id: "task3",
            status: "Go",
            url: "https://www.encode.club/mammothon",
            name: "Complete Mammothon", // Task name
            description: "Complete the Mammothon challenge",
            points: "20"
        }
    ]);

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

    const navigateToTaskPage = (url: string, taskId: string) => {
        window.open(url, '_blank');
        // After the user completes the task, we change the status to "Claim"
        updateTaskStatus(taskId, "Claim");
    };

    const updateTaskStatus = (taskId: string, newStatus: string) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                return { ...task, status: newStatus };
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    const handleClaimPoints = async (taskId: string) => {
        // Award points when the task is claimed
        setPoints((prevPoints) => (prevPoints !== null ? prevPoints + 20 : 20));

        // Update the task status to "Claimed"
        updateTaskStatus(taskId, "Claimed");

        // Save the task completion state (optional: save to backend if needed)
        try {
            const response = await fetch("/api/task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address: walletInfo?.address, taskId }),
            });
            const data = await response.json();
            console.log("Task completed:", data);
        } catch (error) {
            console.error("Error claiming points:", error);
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
            <div className="container flex justify-center items-center min-h-screen bg-gradient-custom">
                <div className="container_taskpage mx-auto max-w-4xl p-8">

                    {/* Centered Information Section */}
                    <div className="text-center mb-8">
                        {points !== null && (
                            <div className="glass-card text-foreground p-6 mb-4">
                                <h2 className="text-2xl font-bold mb-4">WAG</h2>
                                <p className="text-lg">Points: {points}</p>
                            </div>
                        )}

                        {username && (
                            <div className="glass-card text-foreground p-6">

                                <p className="font_taskpage">
                                    <FaWallet size={20} className="button-icon" />: {username}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="glass-card text-foreground p-6 mt-4">
                        <h2 className="text-2xl font-bold mb-4">Tasks</h2>

                        {/* Task Buttons */}
                        {tasks.map((task) => (
                            <div key={task.id} className="task-item mb-4 flex items-center justify-between">
                                <div className="task-description">
                                    <h3 className="text-xl font-semibold">{task.name}</h3> {/* Task Name */}
                                    <p className="text-lg font-medium">{task.description}</p> {/* Task Description */}
                                    <p className="text-sm text-gray-500">+ {task.points}</p> {/* Points */}
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        task.status === "Go" ? navigateToTaskPage(task.url, task.id) : handleClaimPoints(task.id)
                                    }
                                    className={`task-button ${task.status === "Go" ? "bg-orange-500" : "bg-gray-400"}`}
                                >
                                    {task.status === "Go" ? "Bắt đầu" : task.status === "Claim" ? "Claim" : "Claimed"}
                                </button>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Bottom Navbar */}
                <div className="bottom-navbar">
                    <button type="button" className="navbar-button" onClick={openModal}>
                        <FaHome size={20} className="button-icon" />
                        <span>Home</span>
                    </button>
                    <button type="button" className="navbar-button" onClick={navigateToLeaders}>
                        <FaTrophy size={20} className="button-icon" />
                        <span>Leaders</span>
                    </button>
                    <button type="button" className="navbar-button">
                        <FaWallet size={20} className="button-icon" />
                        <span>Earn</span>
                    </button>
                    <button type="button" className="navbar-button">
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


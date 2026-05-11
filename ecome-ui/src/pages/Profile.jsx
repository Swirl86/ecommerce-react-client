import { useAuth } from "@context/AuthContext";
import { useProfileData } from "@hooks/profile/useProfileData";
import PageContainer from "@layout/PageContainer";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const { data } = useProfileData();

    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        if (!accessToken) navigate("/login");
    }, [accessToken, navigate]);

    if (!accessToken) return null;
    if (!data) return null; // global loader handles this

    return (
        <PageContainer>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* ---------------------------------- */}
                {/* TOP NAVIGATION */}
                {/* ---------------------------------- */}
                <div className="bg-white dark:bg-gray-800 border border-[var(--color-border)] rounded-xl shadow-sm sticky top-20 z-20">
                    <div className="flex gap-8 px-6 pt-4">
                        {/* PROFILE TAB */}
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`pb-3 text-lg font-medium relative transition
                                ${
                                    activeTab === "profile"
                                        ? "text-[var(--color-primary-dark)]"
                                        : "text-[var(--color-text-muted)] hover:text-[var(--color-primary-dark)]"
                                }
                            `}
                        >
                            Profile
                            <span
                                className={`absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[var(--color-primary-dark)] transition-all duration-300
                                    ${activeTab === "profile" ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}
                                `}
                            />
                        </button>

                        {/* WISHLIST TAB */}
                        <button
                            onClick={() => setActiveTab("wishlist")}
                            className={`pb-3 text-lg font-medium relative transition
                                ${
                                    activeTab === "wishlist"
                                        ? "text-[var(--color-primary-dark)]"
                                        : "text-[var(--color-text-muted)] hover:text-[var(--color-primary-dark)]"
                                }
                            `}
                        >
                            Wishlist
                            <span
                                className={`absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[var(--color-primary-dark)] transition-all duration-300
                                    ${activeTab === "wishlist" ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}
                                `}
                            />
                        </button>

                        {/* ORDER HISTORY TAB */}
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`pb-3 text-lg font-medium relative transition
                                ${
                                    activeTab === "orders"
                                        ? "text-[var(--color-primary-dark)]"
                                        : "text-[var(--color-text-muted)] hover:text-[var(--color-primary-dark)]"
                                }
                            `}
                        >
                            Order History
                            <span
                                className={`absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[var(--color-primary-dark)] transition-all duration-300
                                    ${activeTab === "orders" ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}
                                `}
                            />
                        </button>
                    </div>
                </div>

                {/* ---------------------------------- */}
                {/* TAB CONTENT: PROFILE */}
                {/* ---------------------------------- */}
                {activeTab === "profile" && (
                    <div className="animate-fadeIn space-y-8">
                        {/* PROFILE PICTURE + NAME + EMAIL */}
                        <div className="bg-white dark:bg-gray-800 border border-[var(--color-border)] rounded-xl shadow-sm p-8 flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-[var(--color-sky)] dark:bg-gray-700 flex items-center justify-center text-4xl text-white">
                                👤
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold text-[var(--color-text)]">
                                    {data.name || "Unnamed User"}
                                </h1>
                                <p className="text-[var(--color-text-muted)]">{data.email}</p>
                            </div>
                        </div>

                        {/* PERSONAL INFORMATION */}
                        <div className="bg-white dark:bg-gray-800 border border-[var(--color-border)] rounded-xl shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                                    Personal Information
                                </h2>
                                <button className="text-[var(--color-primary-dark)] hover:underline">
                                    Edit
                                </button>
                            </div>

                            <div className="space-y-2">
                                <p>
                                    <strong>Name:</strong> {data.name || "Not provided"}
                                </p>
                                <p>
                                    <strong>Email:</strong> {data.email}
                                </p>
                                <p>
                                    <strong>Phone:</strong> {data.phone || "Not provided"}
                                </p>

                                {data.activeOrders?.length > 0 && (
                                    <p>
                                        <strong>Active order:</strong>{" "}
                                        <Link
                                            to={`/orders/${data.activeOrders[0].id}`}
                                            className="text-[var(--color-primary-dark)] hover:underline"
                                        >
                                            View active order
                                        </Link>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ADDRESS */}
                        <div className="bg-white dark:bg-gray-800 border border-[var(--color-border)] rounded-xl shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                                    Address
                                </h2>
                                <button className="text-[var(--color-primary-dark)] hover:underline">
                                    Edit
                                </button>
                            </div>

                            {data.address ? (
                                <div className="space-y-1">
                                    <p>{data.address.street}</p>
                                    <p>
                                        {data.address.postalCode} {data.address.city}
                                    </p>
                                    <p>{data.address.country}</p>
                                </div>
                            ) : (
                                <p className="text-[var(--color-text-muted)] italic">
                                    No address saved yet.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* ---------------------------------- */}
                {/* TAB CONTENT: WISHLIST */}
                {/* ---------------------------------- */}
                {activeTab === "wishlist" && (
                    <div className="animate-fadeIn bg-white dark:bg-gray-800 border border-[var(--color-border)] rounded-xl shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">
                            Wishlist
                        </h2>
                        <p className="text-[var(--color-text-muted)] italic">
                            Wishlist feature coming soon.
                        </p>
                    </div>
                )}

                {/* ---------------------------------- */}
                {/* TAB CONTENT: ORDER HISTORY */}
                {/* ---------------------------------- */}
                {activeTab === "orders" && (
                    <div className="animate-fadeIn bg-white dark:bg-gray-800 border border-[var(--color-border)] rounded-xl shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">
                            Order History
                        </h2>
                        <p className="text-[var(--color-text-muted)] italic">
                            Your past orders will appear here.
                        </p>
                    </div>
                )}
            </div>
        </PageContainer>
    );
}

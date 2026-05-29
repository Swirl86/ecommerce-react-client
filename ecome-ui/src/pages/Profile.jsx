import {
    ProfileActiveOrders,
    ProfileDetails,
    ProfileOrders,
    ProfileTabs,
    ProfileWishlist,
} from "@components/profile";
import { useAuth } from "@context/AuthContext";
import { useProfileData } from "@hooks/profile/useProfileData";
import PageContainer from "@layout/PageContainer";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Profile() {
    const { accessToken, refresh } = useAuth();
    const navigate = useNavigate();
    const { data, refetch } = useProfileData();

    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") ?? "profile";

    const setActiveTab = (tab) => {
        setSearchParams({ tab });
    };

    useEffect(() => {
        if (!accessToken) navigate("/login");
    }, [accessToken, navigate]);

    if (!accessToken) return null;
    if (!data) return null; // global loader handles this

    return (
        <PageContainer>
            <div className="max-w-6xl mx-auto space-y-6">
                <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-8 animate-fadeIn">
                    {activeTab === "profile" && (
                        <ProfileDetails data={data} refetch={refetch} refresh={refresh} />
                    )}
                    {activeTab === "wishlist" && <ProfileWishlist />}
                    {activeTab === "activeOrders" && <ProfileActiveOrders />}
                    {activeTab === "orders" && <ProfileOrders />}
                </div>
            </div>
        </PageContainer>
    );
}

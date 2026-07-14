/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar.tsx";
import Footer from "../../components/Footer.tsx";
import Loader from "../../components/Loader.tsx";
import { useAppContext } from "../../context/AppContext.tsx";
import { ShieldCheckIcon, CheckCircleIcon, BarChart3Icon } from "lucide-react";

// Subcomponents
import AdminApprovals from "../../components/admin/AdminApprovals.tsx";
import AdminStats from "../../components/admin/AdminStats.tsx";
import api from "../../lib/api.ts";
import toast from "react-hot-toast";

export default function AdminDashboard() {
    const { logout } = useAppContext();
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"approvals" | "stats">("approvals");
    const [btnLoading, setBtnLoading] = useState<string | null>(null);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const rRes = await api.get('/admin/restaurants');
            setRestaurants(rRes.data.restaurants);

            const sRes = await api.get('/admin/stats');
            setStats(sRes.data.stats);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveStatus = async (restaurantId: string, status: "approved" | "rejected") => {
        try {
            setBtnLoading(restaurantId);
            await api.put(`/admin/restaurants/${restaurantId}/approve`, { status });
            toast.success(`Restaurant has been marked as ${status.toUpperCase()}.`);

            // Reload local list and stats
            const rRes = await api.get('/admin/restaurants');
            setRestaurants(rRes.data.restaurants);

            const sRes = await api.get('/admin/stats');
            setStats(sRes.data.stats);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setBtnLoading(null);
        }
    };

    useEffect(() => {
        (async () => await fetchAdminData())();
    }, []);

    if (loading) {
        return <Loader text="Loading Master Admin Console..." />;
    }

    // Segregate pending / other restaurants
    const pendingRestaurants = restaurants.filter((r) => r.status === "pending");
    const otherRestaurants = restaurants.filter((r) => r.status !== "pending");

    return (
        <div className="flex flex-col min-h-screen pt-20 bg-surface">
            <Navbar />

            <main className="w-full px-6 py-12 mx-auto grow max-w-7xl md:px-10">
                {/* Heading */}
                <div className="flex flex-col items-start justify-between gap-4 pb-8 mb-8 text-left border-b md:flex-row md:items-center border-outline-variant/10">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-medium font-display md:text-3xl text-primary">
                            <ShieldCheckIcon size={28} className="text-secondary" /> Admin Console
                        </h1>
                        <p className="text-xs text-black/55 mt-1.5">
                            Approve new restaurant partners, audit active slots listings, and review platform booking metrics.
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-error-container hover:bg-error-container/85 text-error px-4 py-2 text-[10px] font-medium tracking-widest uppercase transition-colors rounded-sm cursor-pointer"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    {/* Tab Navigation Sidebar */}
                    <aside className="p-6 space-y-6 bg-white border rounded-md shadow-sm lg:col-span-3 border-outline-variant/20 h-fit">
                        <nav className="flex flex-col gap-1.5">
                            <button
                                onClick={() => setActiveTab("approvals")}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium tracking-wider uppercase text-left rounded-sm cursor-pointer transition-colors ${activeTab === "approvals" ? "bg-primary text-white" : "text-black/55 hover:bg-surface"}`}
                            >
                                <CheckCircleIcon size={14} />
                                Approvals ({pendingRestaurants.length} Pending)
                            </button>
                            <button
                                onClick={() => setActiveTab("stats")}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium tracking-wider uppercase text-left rounded-sm cursor-pointer transition-colors ${activeTab === "stats" ? "bg-primary text-white" : "text-black/55 hover:bg-surface"}`}
                            >
                                <BarChart3Icon size={14} />
                                Analytics & Stats
                            </button>
                        </nav>
                    </aside>

                    {/* Content Panel */}
                    <div className="space-y-8 lg:col-span-9">
                        {/* Tab 1: Restaurant Approvals */}
                        {activeTab === "approvals" && (
                            <AdminApprovals
                                pendingRestaurants={pendingRestaurants}
                                otherRestaurants={otherRestaurants}
                                btnLoading={btnLoading}
                                onApproveStatus={handleApproveStatus}
                            />
                        )}

                        {/* Tab 2: Analytics & Stats */}
                        {activeTab === "stats" && stats && <AdminStats stats={stats} />}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

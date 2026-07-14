/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext.tsx";
import Navbar from "../../components/Navbar.tsx";
import Footer from "../../components/Footer.tsx";
import Loader from "../../components/Loader.tsx";
import { CalendarIcon, SettingsIcon } from "lucide-react";
import RestaurantWizard from "../../components/owner/RestaurantWizard.tsx";
import PendingApproval from "../../components/owner/PendingApproval.tsx";
import RequestRejected from "../../components/owner/RequestRejected.tsx";
import OwnerBookings from "../../components/owner/OwnerBookings.tsx";
import OwnerProfileDetails from "../../components/owner/OwnerProfileDetails.tsx";
import api from "../../lib/api.ts";
import toast from "react-hot-toast";

export default function OwnerDashboard() {
    const { logout } = useAppContext();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"bookings" | "details">("bookings");

    const fetchOwnerData = async () => {
        try {
            const res = await api.get("/owner/restaurant");
            setRestaurant(res.data.restaurant);

            if (res.data.restaurant) {
                if (res.data.restaurant.status === "approved") {
                    const bookingsRes = await api.get('/owner/bookings');
                    setBookings(bookingsRes.data.bookings);
                }
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => await fetchOwnerData())();
    }, []);

    if (loading) {
        return <Loader text="Loading Owner Dashboard..." />;
    }

    return (
        <div className="flex flex-col min-h-screen pt-20 bg-surface">
            <Navbar />

            <main className="w-full px-6 py-12 mx-auto grow max-w-7xl md:px-10">
                {/* Heading */}
                <div className="flex flex-col items-start justify-between gap-4 pb-8 mb-8 border-b md:flex-row md:items-center border-outline-variant/10">
                    <div>
                        <h1 className="text-2xl font-display md:text-3xl text-primary">Restaurant Portal</h1>
                        <p className="text-xs text-black/55 mt-1.5">Review capacity limits and process live reservations.</p>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-error-container hover:bg-error-container/85 text-error px-4 py-2 text-[10px] font-medium tracking-widest uppercase transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Case 1: No Restaurant Setup Profile */}
                {!restaurant ? (
                    <RestaurantWizard setRestaurant={setRestaurant} />
                ) : restaurant.status === "pending" ? (
                    /* Case 2: Profile Pending Approval */
                    <PendingApproval restaurant={restaurant} />
                ) : restaurant.status === "rejected" ? (
                    /* Case 3: Rejected */
                    <RequestRejected restaurantName={restaurant.name} />
                ) : (
                    /* Case 4: Approved - Full Dashboard Panel */
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                        {/* Left Tab selector sidebar */}
                        <aside className="p-6 space-y-6 bg-white border rounded-md shadow-sm lg:col-span-3 border-outline-variant/20 h-fit">
                            <div className="flex items-center gap-3.5 border-b border-outline-variant/10 pb-5">
                                <span className="flex items-center justify-center w-12 h-12 text-base font-medium rounded-full bg-primary/10 text-primary">
                                    {restaurant.name.charAt(0)}
                                </span>
                                <div>
                                    <h4 className="text-base font-medium font-display text-primary line-clamp-1">{restaurant.name}</h4>
                                    <span className="text-[9px] text-secondary tracking-widest uppercase bg-secondary-container/20 px-2 py-0.5 rounded-sm inline-block mt-0.5">
                                        APPROVED
                                    </span>
                                </div>
                            </div>

                            <nav className="flex flex-col gap-1.5">
                                <button
                                    onClick={() => setActiveTab("bookings")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium tracking-wider uppercase text-left rounded-sm cursor-pointer transition-colors ${
                                        activeTab === "bookings" ? "bg-primary text-white" : "text-black/55 hover:bg-surface"
                                    }`}
                                >
                                    <CalendarIcon size={14} />
                                    Bookings ({bookings.length})
                                </button>

                                <button
                                    onClick={() => setActiveTab("details")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium tracking-wider uppercase text-left rounded-sm cursor-pointer transition-colors ${
                                        activeTab === "details" ? "bg-primary text-white" : "text-black/55 hover:bg-surface"
                                    }`}
                                >
                                    <SettingsIcon size={14} />
                                    Profile Details
                                </button>
                            </nav>
                        </aside>

                        {/* Content Area */}
                        <div className="space-y-8 lg:col-span-9">
                            {/* Tab 1: Bookings List */}
                            {activeTab === "bookings" && (
                                <OwnerBookings bookings={bookings} setBookings={setBookings} totalSeats={restaurant.totalSeats} />
                            )}

                            {/* Tab 3: Update details & slots capacity */}
                            {activeTab === "details" && <OwnerProfileDetails restaurant={restaurant} setRestaurant={setRestaurant} />}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

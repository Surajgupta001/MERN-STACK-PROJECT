/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import RestaurantCard from "../components/RestaurantCard.tsx";
import AuthModal from "../components/AuthModal.tsx";
import { CalendarIcon, UsersIcon, ClockIcon, MapPinIcon, CalendarDaysIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/api.ts";

export default function Dashboard() {
    const { user } = useAppContext();

    const [bookings, setBookings] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    // Fetch user bookings
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoadingBookings(true);
                const res = await api.get('/bookings/my');
                setBookings(res.data.bookings);
            } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message);
            } finally {
                setLoadingBookings(false);
            }
        };

        if (user) {
            fetchBookings();
        }
    }, [user]);

    // Fetch generic recommendations
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await api.get("/restaurants/featured");
                setRecommendations(res.data.featured || []);
            } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message);
            }
        };
        fetchRecommendations();
    }, []);

    const handleCancelBooking = async (bookingId: string) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        try {
            await api.put(`/bookings/${bookingId}/cancel`);
            
            // Update local state to remove the cancelled booking
            setBookings((prev)=> prev.map(b => b._id === bookingId ? { ...b, status: "cancelled" } : b));
            toast.success("Reservation cancelled successfully.");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        }
    };

    if (!user) return null;

    // Filter bookings into upcoming and past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingBookings = bookings.filter((b) => {
        const bDate = new Date(b.date);
        return bDate >= today && b.status === "confirmed";
    });

    const pastBookings = bookings.filter((b) => {
        const bDate = new Date(b.date);
        return bDate < today || b.status !== "confirmed";
    });

    return (
        <div className="flex flex-col min-h-screen pt-20 bg-surface">
            <Navbar />
            <AuthModal />

            <main className="w-full px-6 py-12 mx-auto grow max-w-7xl md:px-10">
                {/* Main Content Area */}
                <div className="space-y-10 grow">
                    {/* Welcoming header */}
                    <div className="pb-4 border-b border-outline-variant/10">
                        <h2 className="text-2xl font-semibold font-display md:text-3xl text-primary">
                            Welcome back, {user.name.split(" ")[0]}
                        </h2>
                        <p className="text-xs text-black/55 mt-1.5">Manage your upcoming dining experiences.</p>
                    </div>

                    <div className="space-y-10">
                        {/* Upcoming Reservations */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium font-display text-primary">Upcoming Bookings</h3>

                            {loadingBookings ? (
                                <div className="flex justify-center p-12 text-center bg-white border border-outline-variant/10">
                                    <div className="w-6 h-6 border-2 rounded-full border-outline-variant/30 border-t-secondary animate-spin"></div>
                                </div>
                            ) : upcomingBookings.length === 0 ? (
                                <div className="p-12 text-center bg-white border rounded-md border-outline-variant/10">
                                    <CalendarDaysIcon size={36} className="mx-auto mb-2 text-outline-variant" />

                                    <p className="text-xs italic text-black/55">No upcoming reservations scheduled.</p>

                                    <Link
                                        to="/search"
                                        className="inline-block mt-4 bg-primary hover:bg-secondary text-white text-[10px] font-medium tracking-widest uppercase px-6 py-2.5 transition-colors"
                                    >
                                        Book a Table
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {upcomingBookings.map((b) => (
                                        <div
                                            key={b._id}
                                            className="flex flex-col items-start justify-between gap-6 p-6 bg-white border rounded-md shadow-sm border-outline-variant/20 md:flex-row md:items-center"
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-16 h-16 overflow-hidden rounded-sm shrink-0 bg-surface">
                                                    <img
                                                        src={b.restaurant?.image}
                                                        alt={b.restaurant?.name}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-medium text-secondary tracking-widest uppercase">
                                                        {b.restaurant?.cuisine}
                                                    </span>
                                                    <h4 className="text-base font-medium font-display text-primary">
                                                        {b.restaurant?.name}
                                                    </h4>
                                                    <p className="flex items-center gap-1 text-xs text-black/55">
                                                        <MapPinIcon size={12} />
                                                        {b.restaurant?.location}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center w-full gap-6 p-4 text-xs border rounded-md text-on-surface bg-surface-container-low border-outline-variant/10 md:w-auto">
                                                <div className="flex items-center gap-2 pr-4 md:border-r border-outline-variant/20">
                                                    <CalendarIcon size={14} className="text-secondary" />
                                                    <span className="font-medium">{new Date(b.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 pr-4 md:border-r border-outline-variant/20">
                                                    <ClockIcon size={14} className="text-secondary" />
                                                    <span className="font-medium">{b.time} PM</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <UsersIcon size={14} className="text-secondary" />
                                                    <span className="font-medium">{b.guests} Guests</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-end w-full gap-3 md:w-auto">
                                                <button
                                                    onClick={() => handleCancelBooking(b._id)}
                                                    className="px-5 py-2.5 text-[10px] font-medium tracking-widest uppercase text-error hover:bg-error-container/20 border border-outline-variant/40 rounded-sm cursor-pointer transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Past & Cancelled Dining History */}
                        <div className="space-y-4">
                            {loadingBookings
                                ? null
                                : pastBookings.length !== 0 && (
                                      <>
                                          <h3 className="text-lg font-medium font-display text-primary">Dining History</h3>
                                          <div className="overflow-hidden bg-white border rounded-md shadow-sm border-outline-variant/20">
                                              <table className="w-full text-xs text-left border-collapse">
                                                  <thead>
                                                      <tr className="bg-surface-container-low border-b border-outline-variant/10 text-[10px] font-medium tracking-wider text-black/55 uppercase">
                                                          <th className="p-4">Restaurant</th>
                                                          <th className="p-4">Date & Time</th>
                                                          <th className="p-4">Party</th>
                                                          <th className="p-4">Status</th>
                                                      </tr>
                                                  </thead>
                                                  <tbody className="divide-y divide-outline-variant/10">
                                                      {pastBookings.map((b) => (
                                                          <tr key={b._id} className="hover:bg-surface/50">
                                                              <td className="p-4 font-medium text-primary">
                                                                  <Link
                                                                      to={`/restaurant/${b.restaurant?.slug}`}
                                                                      className="hover:text-secondary"
                                                                  >
                                                                      {b.restaurant?.name}
                                                                  </Link>
                                                              </td>
                                                              <td className="p-4">
                                                                  {new Date(b.date).toLocaleDateString()} at {b.time} PM
                                                              </td>
                                                              <td className="p-4">
                                                                  {b.guests} {b.guests === 1 ? "Guest" : "Guests"}
                                                              </td>
                                                              <td className="p-4">
                                                                  <span
                                                                      className={`inline-block py-0.5 px-2 text-[9px] font-medium tracking-wider uppercase rounded-sm ${
                                                                          b.status === "confirmed"
                                                                              ? "bg-secondary-container/30 text-on-secondary-container"
                                                                              : b.status === "completed"
                                                                                ? "bg-green-100 text-green-800"
                                                                                : "bg-error-container text-on-error-container"
                                                                      }`}
                                                                  >
                                                                      {b.status}
                                                                  </span>
                                                              </td>
                                                          </tr>
                                                      ))}
                                                  </tbody>
                                              </table>
                                          </div>
                                      </>
                                  )}
                        </div>
                    </div>

                    {/* Recommendations Section */}
                    {recommendations.length > 0 && (
                        <div className="pt-10 space-y-4 border-t border-outline-variant/10">
                            <h3 className="text-lg font-medium font-display text-primary">Recommended for You</h3>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {recommendations.slice(0, 3).map((r) => (
                                    <RestaurantCard key={r._id} restaurant={r} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

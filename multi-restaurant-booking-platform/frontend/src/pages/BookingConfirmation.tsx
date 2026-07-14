/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../components/Loader.tsx";
import BookingSuccess from "../components/booking/BookingSuccess.tsx";
import BookingSummary from "../components/booking/BookingSummary.tsx";
import BookingForm from "../components/booking/BookingForm.tsx";
import api from "../lib/api.ts";

export default function BookingConfirmation() {
    const { slug } = useParams<{ slug: string }>();
    const [searchParams] = useSearchParams();
    const { user } = useAppContext();
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

    // Form inputs
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [occasion, setOccasion] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");

    // From Query Params
    const slot = searchParams.get("slot") || "";
    const date = searchParams.get("date") || "";
    const guests = searchParams.get("guests") || "2";

    useEffect(() => {
        // Prefill form when user details load
        if (user) {
            (() => {
                setName(user.name);
                setEmail(user.email);
                if (user.phone) setPhone(user.phone);
            })();
        }
    }, [user]);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/restaurants/${slug}`);
                setRestaurant(res.data.restaurant);
            } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchRestaurant();
        }
    }, [slug, navigate]);

    if (loading) {
        return <Loader text="Retrieving Dining Details..." />;
    }

    if (!restaurant) return null;

    const handleConfirmSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!slot || !date) {
            toast.error("Reservation details are missing. Return to restaurant details.");
            return;
        }

        try {
            setConfirming(true);
            const res = await api.post("/bookings", {
                restaurantId: restaurant._id,
                date,
                time: slot,
                guests,
                occasion,
                specialRequests,
            })
            setConfirmedBooking(res.data.populationBooking);
            toast.success("Reservation confirmed!");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setConfirming(false);
        }
    };

    // Render Success Screen
    if (confirmedBooking) {
        return (
            <div className="flex flex-col min-h-screen pt-20 bg-surface">
                <Navbar />
                <main className="flex items-center justify-center px-6 py-12 grow">
                    <BookingSuccess confirmedBooking={confirmedBooking} restaurant={restaurant} date={date} slot={slot} guests={guests} />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen pt-20 bg-surface">
            <Navbar />

            {/* Main Booking Content */}
            <main className="w-full px-6 py-12 mx-auto grow max-w-7xl md:px-10">
                {/* Progress bar header */}
                <div className="flex items-center gap-2 pb-4 mb-10 text-xs border-b border-outline-variant/10 text-black/55">
                    <Link to={`/restaurant/${restaurant.slug}`} className="transition-colors hover:text-primary">
                        {restaurant.name}
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-primary">Details & Confirmation</span>
                </div>

                <div className="grid items-start grid-cols-1 gap-10 lg:grid-cols-12">
                    {/* Left Column (Reservation Summary) */}
                    <div className="lg:col-span-5">
                        <BookingSummary restaurant={restaurant} date={date} slot={slot} guests={guests} />
                    </div>

                    {/* Right Column (Guest Details Form) */}
                    <div className="lg:col-span-7">
                        <BookingForm
                            name={name}
                            setName={setName}
                            email={email}
                            setEmail={setEmail}
                            phone={phone}
                            setPhone={setPhone}
                            occasion={occasion}
                            setOccasion={setOccasion}
                            specialRequests={specialRequests}
                            setSpecialRequests={setSpecialRequests}
                            confirming={confirming}
                            onSubmit={handleConfirmSubmit}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

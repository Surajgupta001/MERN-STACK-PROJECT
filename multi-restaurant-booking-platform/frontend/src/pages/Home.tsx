/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import AuthModal from "../components/AuthModal.tsx";
import Hero from "../components/home/Hero.tsx";
import CuisineBrowse from "../components/home/CuisineBrowse.tsx";
import TrendingRow from "../components/home/TrendingRow.tsx";
import MembershipSection from "../components/home/MembershipSection.tsx";
import NewsletterCTA from "../components/home/NewsletterCTA.tsx";
import api from "../lib/api.ts";
import toast from "react-hot-toast";

export default function Home() {
    const [trending, setTrending] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await api.get("/restaurants/featured");
                setTrending(res.data.featured || []);
                setLoading(false);
            } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message);
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    return (
        <div className="flex flex-col min-h-screen pt-0 bg-surface">
            <Navbar />
            <AuthModal />
            <main className="flex-1">
                <Hero />
                <CuisineBrowse />
                <TrendingRow trending={trending} loading={loading} />
                <MembershipSection />
                <NewsletterCTA />
            </main>
            <Footer />
        </div>
    );
}

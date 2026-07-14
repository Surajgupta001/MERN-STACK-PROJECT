/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import RestaurantCard from "../components/RestaurantCard.tsx";
import AuthModal from "../components/AuthModal.tsx";
import { SlidersHorizontal, Search as SearchIcon, X, Check, MapPin, SearchXIcon } from "lucide-react";
import api from "../lib/api.ts";
import toast from "react-hot-toast";

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // UI Layout states
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Filter states initialized from URL params
    const searchVal = searchParams.get("search") || "";
    const locationVal = searchParams.get("location") || "";
    const cuisinesSelected = searchParams.getAll("cuisine");
    const pricesSelected = searchParams.getAll("priceRange");
    const sortVal = searchParams.get("sort") || "";

    // Temp text inputs for immediate user typing (submit on enter/click)
    const [tempSearch, setTempSearch] = useState(searchVal);
    const [tempLocation, setTempLocation] = useState(locationVal);

    useEffect(() => {
        // Sync inputs with URL params on navigation
        (() => {
            setTempSearch(searchVal);
            setTempLocation(locationVal);
        })();
    }, [searchVal, locationVal]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                setLoading(true);
                // Contstruct query string from searchParams
                const res = await api.get(`/restaurants?${searchParams.toString()}`);
                setRestaurants(res.data.restaurants || []);
                setLoading(false);
            } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message);
                setLoading(false);

            }
        };

        fetchRestaurants();
    }, [searchParams]);

    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nextParams = new URLSearchParams(searchParams);
        if (tempSearch) nextParams.set("search", tempSearch);
        else nextParams.delete("search");

        if (tempLocation) nextParams.set("location", tempLocation);
        else nextParams.delete("location");

        setSearchParams(nextParams);
    };

    const handleCuisineToggle = (cuisine: string) => {
        const nextParams = new URLSearchParams(searchParams);
        const current = nextParams.getAll("cuisine");

        if (current.includes(cuisine)) {
            // Remove
            const updated = current.filter((c) => c !== cuisine);
            nextParams.delete("cuisine");
            updated.forEach((u) => nextParams.append("cuisine", u));
        } else {
            // Add
            nextParams.append("cuisine", cuisine);
        }
        setSearchParams(nextParams);
    };

    const handlePriceToggle = (price: string) => {
        const nextParams = new URLSearchParams(searchParams);
        const current = nextParams.getAll("priceRange");

        if (current.includes(price)) {
            const updated = current.filter((p) => p !== price);
            nextParams.delete("priceRange");
            updated.forEach((u) => nextParams.append("priceRange", u));
        } else {
            nextParams.append("priceRange", price);
        }
        setSearchParams(nextParams);
    };

    const handleSortChange = (sort: string) => {
        const nextParams = new URLSearchParams(searchParams);
        if (sort) {
            nextParams.set("sort", sort);
        } else {
            nextParams.delete("sort");
        }
        setSearchParams(nextParams);
    };

    const clearAllFilters = () => {
        setSearchParams(new URLSearchParams());
        setTempSearch("");
        setTempLocation("");
    };

    const priceOptions = ["$", "$$", "$$$", "$$$$"];
    const cuisineOptions = ["Italian", "French", "Japanese", "Steakhouse", "Vegetarian"];

    return (
        <div className="flex flex-col min-h-screen pt-20 bg-surface">
            <Navbar />
            <AuthModal />

            {/* Sub-header / Search inputs */}
            <div className="sticky z-10 py-4 bg-white border-b shadow-sm border-outline-variant/10 top-16">
                <div className="flex flex-col items-center justify-between gap-4 px-6 mx-auto max-w-7xl md:px-10 md:flex-row">
                    <form onSubmit={handleTextSubmit} className="flex flex-wrap items-center w-full gap-3 md:w-auto">
                        <div className="relative grow sm:grow-0 min-w-[200px]">
                            <SearchIcon size={16} className="absolute left-2.5 top-2 text-black/55/70" />
                            <input
                                type="text"
                                placeholder="Search cuisine or name..."
                                value={tempSearch}
                                onChange={(e) => setTempSearch(e.target.value)}
                                className="w-full py-2 pr-3 text-xs border rounded-md pl-9 border-outline-variant/40 focus:border-secondary focus:outline-none bg-surface-container-low/30"
                            />
                        </div>
                        <div className="relative grow sm:grow-0 min-w-[200px]">
                            <MapPin size={16} className="absolute left-2.5 top-2 text-black/55/70" />
                            <input
                                type="text"
                                placeholder="Location..."
                                value={tempLocation}
                                onChange={(e) => setTempLocation(e.target.value)}
                                className="w-full py-2 pr-3 text-xs border rounded-md pl-9 border-outline-variant/40 focus:border-secondary focus:outline-none bg-surface-container-low/30"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary hover:bg-secondary text-white text-[10px] font-medium tracking-wider uppercase px-5 py-2.5 rounded-md cursor-pointer transition-colors"
                        >
                            UPDATE
                        </button>
                    </form>

                    <div className="flex justify-end w-full gap-3 md:w-auto">
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="md:hidden flex items-center gap-1.5 border border-outline-variant/50 hover:border-primary text-xs font-medium px-4 py-2 bg-white cursor-pointer transition-colors"
                        >
                            <SlidersHorizontal size={14} />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>
            </div>

            <main className="flex w-full gap-10 px-6 py-10 mx-auto grow max-w-7xl md:px-10">
                {/* Desktop Sidebar Filters */}
                <aside className="hidden w-64 md:block shrink-0">
                    <div className="sticky space-y-8 top-44">
                        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/10">
                            <h3 className="text-lg font-medium font-display text-primary">Filters</h3>
                            <button
                                onClick={clearAllFilters}
                                className="text-[10px] font-medium text-secondary hover:text-primary tracking-wider uppercase cursor-pointer"
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Cuisine Filter */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-medium tracking-wider uppercase text-primary">Cuisine</h4>
                            <div className="space-y-2">
                                {cuisineOptions.map((c) => {
                                    const active = cuisinesSelected.includes(c);
                                    return (
                                        <button
                                            key={c}
                                            onClick={() => handleCuisineToggle(c)}
                                            className="flex items-center justify-between w-full py-1 text-xs text-left transition-colors cursor-pointer text-black/55 hover:text-primary"
                                        >
                                            <span>{c}</span>
                                            <div
                                                className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${active ? "bg-primary border-primary text-white" : "border-outline-variant"
                                                    }`}
                                            >
                                                {active && <Check size={10} />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className="space-y-3">
                            <h4 className="text-xs tracking-wider uppercase text-primary">Price Range</h4>
                            <div className="grid grid-cols-4 gap-1.5">
                                {priceOptions.map((p) => {
                                    const active = pricesSelected.includes(p);
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => handlePriceToggle(p)}
                                            className={`py-2 text-center text-xs transition-colors cursor-pointer border rounded-sm ${active
                                                    ? "bg-primary border-primary text-white"
                                                    : "border-outline-variant/50 text-on-surface hover:border-primary"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Results Section */}
                <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between pb-4 mb-8 border-b border-outline-variant/10">
                        <p className="text-sm text-black/55">
                            {restaurants.length} {restaurants.length === 1 ? "Restaurant" : "Restaurants"} Available
                        </p>

                        <div className="flex items-center gap-2">
                            <span className="text-xs tracking-wider uppercase text-black/55">SORT BY:</span>
                            <select
                                value={sortVal}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="text-xs bg-transparent border border-outline-variant/30 px-3 py-1.5 focus:outline-none cursor-pointer rounded-sm"
                            >
                                <option value="">Default (Newest)</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-24 grow">
                            <div className="w-10 h-10 border-2 rounded-full border-outline-variant/30 border-t-secondary animate-spin"></div>
                        </div>
                    ) : restaurants.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center grow">
                            <SearchXIcon size={36} className="mb-4 text-outline-variant" />
                            <h3 className="mb-2 text-xl font-medium font-display">No Restaurants Found</h3>
                            <p className="max-w-sm mb-6 text-xs text-black/50">
                                We couldn't find any premium establishments matching your search query. Try widening your filters.
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="px-6 py-3 text-xs tracking-widest text-white uppercase transition-colors cursor-pointer bg-primary hover:bg-secondary"
                            >
                                CLEAR ALL FILTERS
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 lg:flex-row grow">
                            {/* Restaurants List Grid */}
                            <div className="grid grid-cols-1 gap-6 grow lg:grid-cols-2 ">
                                {restaurants.map((restaurant) => (
                                    <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Mobile Filters Drawer Modal */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 flex justify-end duration-200 bg-black/50 backdrop-blur-sm md:hidden animate-in fade-in">
                    <div className="flex flex-col justify-between h-full p-6 duration-300 bg-white shadow-2xl w-80 animate-in slide-in-from-right">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/10">
                                <h3 className="text-lg font-medium font-display text-primary">Filters</h3>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="p-1 transition-colors cursor-pointer text-black/55 hover:text-primary"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Cuisines */}
                            <div className="py-6 space-y-3">
                                <h4 className="text-xs tracking-wider uppercase text-primary">Cuisine</h4>
                                <div className="space-y-2">
                                    {cuisineOptions.map((c) => {
                                        const active = cuisinesSelected.includes(c);
                                        return (
                                            <button
                                                key={c}
                                                onClick={() => handleCuisineToggle(c)}
                                                className="flex items-center justify-between w-full py-1 text-xs text-left cursor-pointer text-black/55 hover:text-primary"
                                            >
                                                <span>{c}</span>
                                                <div
                                                    className={`w-4 h-4 border rounded-sm flex items-center justify-center ${active ? "bg-primary border-primary text-white" : "border-outline-variant"
                                                        }`}
                                                >
                                                    {active && <Check size={10} />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Prices */}
                            <div className="py-4 space-y-3 border-t border-outline-variant/10">
                                <h4 className="text-xs font-medium tracking-wider uppercase text-primary">Price Range</h4>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {priceOptions.map((p) => {
                                        const active = pricesSelected.includes(p);
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => handlePriceToggle(p)}
                                                className={`py-2 text-center text-xs font-medium transition-colors cursor-pointer border rounded-sm ${active
                                                        ? "bg-primary border-primary text-white"
                                                        : "border-outline-variant/50 text-on-surface hover:border-primary"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Drawer Bottom Actions */}
                        <div className="flex gap-3 pt-4 border-t border-outline-variant/10">
                            <button
                                onClick={clearAllFilters}
                                className="flex-1 py-3 text-xs font-medium tracking-widest uppercase border cursor-pointer border-outline-variant/50"
                            >
                                CLEAR
                            </button>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="flex-1 py-3 text-xs font-medium tracking-widest text-white uppercase cursor-pointer bg-primary hover:bg-secondary"
                            >
                                APPLY
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

import { XIcon, CheckCircleIcon, BadgeInfoIcon, GlobeIcon, UserIcon } from "lucide-react";
import { useEffect } from "react";

const ListingDetailsModal = ({ listing, onClose }) => {
    
    const currency = import.meta.env.VITE_CURRENCY || "$";

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "auto");
    }, []);

    return (
        <div className="fixed inset-0 bg-black/70 z-100 backdrop-blur flex items-center justify-center sm:p-4">
            <div className="bg-white sm:rounded-lg w-full max-w-2xl h-screen sm:h-[600px] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 text-white bg-linear-to-r from-indigo-600 to-indigo-400 sm:rounded-t-lg">
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold">{listing.title}</h3>
                        <p className="text-sm text-indigo-100">
                            @{listing.username} on {listing.platform}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1 ml-4 transition-colors rounded-lg hover:bg-white/20">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-5 overflow-y-auto text-gray-700">
                    {/* Image Carousel */}
                    <div className="grid gap-3 overflow-x-auto sm:grid-cols-2 lg:grid-cols-3">
                        {listing.images?.map((img, i) => (
                            <img key={i} src={img} alt={`${listing.title}-${i}`} className="border border-gray-200 rounded-lg " />
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                        <div className="p-3 border border-gray-200 rounded-lg">
                            <p className="font-medium">Followers</p>
                            <p className="font-semibold text-indigo-600">{listing.followers_count?.toLocaleString()}</p>
                        </div>
                        <div className="p-3 border border-gray-200 rounded-lg">
                            <p className="font-medium">Engagement Rate</p>
                            <p className="font-semibold text-indigo-600">{listing.engagement_rate}%</p>
                        </div>
                        <div className="p-3 border border-gray-200 rounded-lg">
                            <p className="font-medium">Monthly Views</p>
                            <p className="font-semibold text-indigo-600">{listing.monthly_views?.toLocaleString()}</p>
                        </div>
                        <div className="p-3 border border-gray-200 rounded-lg">
                            <p className="font-medium">Niche</p>
                            <p className="font-semibold text-gray-800 capitalize">{listing.niche}</p>
                        </div>
                        <div className="p-3 border border-gray-200 rounded-lg">
                            <p className="font-medium">Country</p>
                            <p className="font-semibold text-gray-800">{listing.country}</p>
                        </div>
                        <div className="p-3 border border-gray-200 rounded-lg">
                            <p className="font-medium">Age Range</p>
                            <p className="font-semibold text-gray-800">{listing.age_range}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="flex items-center gap-1 mb-1 font-semibold">
                            <BadgeInfoIcon className="w-4 h-4 text-indigo-500" /> Description
                        </h4>
                        <p className="text-sm leading-relaxed">{listing.description}</p>
                    </div>

                    {/* Status / Verification */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${listing.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>{listing.status?.toUpperCase()}</span>
                        {listing.verified && (
                            <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                                <CheckCircleIcon size={14} /> Verified
                            </span>
                        )}
                        {listing.monetized && <span className="px-2 py-1 text-xs font-semibold text-yellow-600 bg-yellow-100 rounded-full">Monetized</span>}
                        {listing.featured && <span className="px-2 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full">Featured</span>}
                        {listing.platformAssured && <span className="px-2 py-1 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-600">Platform Assured</span>}
                    </div>

                    {/* Owner Info */}
                    {listing.owner && (
                        <div className="pt-3 mt-3 border-t border-gray-200">
                            <h4 className="flex items-center gap-1 mb-2 font-semibold">
                                <UserIcon className="w-4 h-4 text-gray-500" /> Owner
                            </h4>
                            <div className="flex items-center gap-3">
                                <img src={listing.owner.image} alt={listing.owner.name} className="object-cover border border-gray-200 rounded-full size-8" />
                                <div>
                                    <p className="font-medium">{listing.owner.name}</p>
                                    <p className="text-sm text-gray-500">{listing.owner.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Customer Info */}
                    {listing.customer && (
                        <div className="pt-3 mt-3 border-t border-gray-200">
                            <h4 className="flex items-center gap-1 mb-2 font-semibold">
                                <UserIcon className="w-4 h-4 text-gray-500" /> Customer
                            </h4>
                            <div className="flex items-center gap-3">
                                <img src={listing.customer.image} alt={listing.customer.name} className="object-cover border border-gray-200 rounded-full size-8" />
                                <div>
                                    <p className="font-medium">{listing.customer.name}</p>
                                    <p className="text-sm text-gray-500">{listing.customer.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Price Section */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <GlobeIcon size={15} /> Listed on {new Date(listing.createdAt).toLocaleDateString()}
                        </div>
                        <p className="text-lg font-semibold text-indigo-600">{currency}{listing.price?.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetailsModal;

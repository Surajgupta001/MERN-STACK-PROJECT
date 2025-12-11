import { ArrowLeftIcon, FilterIcon } from 'lucide-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
import ListingCard from '../components/ListingCard';
import FilterSidebar from '../components/FilterSidebar';

function Marketplace() {

  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');

  const navigate = useNavigate();

  const [showFilterPhone, setShowFilterPhone] = useState(false);
  const [filters, setFilters] = useState({
    platform: null,
    maxPrice: 100000,
    minFollowers: 0,
    niche: null,
    verified: false,
    monetized: false,
  });

  const { listings } = useSelector((state) => state.listing);

  const filteredListings = listings.filter((listing) => {

    if (filters.platform && filters.platform.length > 0) {
      if (!filters.platform.includes(listing.platform)) {
        return false;
      }
    }

    if (filters.maxPrice) {
      if (listing.price > filters.maxPrice) {
        return false;
      }
    }

    if (filters.minFollowers) {
      if (listing.followers < filters.minFollowers) {
        return false;
      }
    }

    if (filters.niche && filters.niche.length > 0) {
      if (!filters.niche.includes(listing.niche)) {
        return false;
      }
    }

    if (filters.verified && listing.verified !== filters.verified) {
      return false;
    }

    if (filters.monetized && listing.monetized !== filters.monetized) {
      return false;
    }

    if (search) {
      const trimed = search.trim();
      if (
        !listing.title.toLowerCase().includes(trimed.toLowerCase()) &&
        !listing.username.toLowerCase().includes(trimed.toLowerCase()) &&
        !listing.description.toLowerCase().includes(trimed.toLowerCase()) &&
        !listing.platform.toLowerCase().includes(trimed.toLowerCase()) &&
        !listing.niche.toLowerCase().includes(trimed.toLowerCase())
      ) {
        return false;
      }
    }

    return true;

  })

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32'>
      <div className='flex items-center justify-between text-slate-500'>
        <button onClick={() => { navigate('/'); scrollTo(0, 0) }} className='flex items-center gap-2 py-5'>
          <ArrowLeftIcon className='size-4' />
          Back to Home
        </button>
        <button onClick={() => setShowFilterPhone(true)} className='flex items-center gap-2 py-5 sm:hidden'>
          <FilterIcon className='size-4' />
          Filter
        </button>
      </div>
      <div className='relative flex items-start justify-between gap-8 pb-8'>
        <FilterSidebar showFilterPhone={showFilterPhone} setShowFilterPhone={setShowFilterPhone} filters={filters} setFilters={setFilters} />
        <div className='grid flex-1 gap-4 xl:grid-cols-2'>
          {filteredListings.sort((a, b) => a.featured ? -1 : b.featured ? 1 : 0).map((listing, index) => (
            <div key={index} className='w-full max-w-3xl mx-auto rounded-xl'>
              {/* Reuse ListingCard component */}
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Marketplace

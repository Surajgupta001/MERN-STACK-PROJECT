import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProfileLink, platformIcons } from '../assets/assets';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftIcon, ArrowUpRightFromSquareIcon, Calendar, CheckCircle, ChevronLeftIcon, ChevronRightIcon, DollarSign, Eye, LineChart, Loader2Icon, MapPin, MessageSquareMoreIcon, ShoppingBagIcon, Users } from 'lucide-react';
import { setChat } from '../app/features/chatSlice';

function ListingDetails() {

  const dispatch = useDispatch();
  
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || '$';

  const [listing, setListing] = useState(null);
  const profileLink = listing && getProfileLink(listing.platform, listing.username);

  const { listingId } = useParams();
  const { listings } = useSelector((state) => state.listing);

  const [current, setCurrent] = useState(0);
  const images = listing?.images || [];

  const prevSlide = () => setCurrent((prev) => (
    prev === 0 ? images.length - 1 : prev - 1
  ));

  const nextSlide = () => setCurrent((prev) => (
    prev === images.length - 1 ? 0 : prev + 1
  ));

  const purchaseAccount = () => {

  };

  const loadChat = () => {
    dispatch(setChat({
      listing: listing,
    }))
  };

  useEffect(() => {
    const listing = listings.find((listing) => listing.id === listingId);
    if (listing) {
      setListing(listing);
    }
  }, [listingId, listings]);

  return listing ? (
    <div className='min-h-screen px-6 mx-auto md:px-16 lg:px-24 xl:px-32'>
      <button onClick={() => navigate(-1)} className='flex items-center gap-2 py-5 text-slate-600'>
        <ArrowLeftIcon className='size-4' />
        Go to Previous page
      </button>
      <div className='flex items-start gap-10 max-md:flex-col'>
        <div className='flex-1 max-md:w-full'>
          {/* Top Sections */}
          <div className='p-6 mb-5 bg-white border border-gray-200 rounded-xl'>
            <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
              <div className='flex items-start gap-3'>
                <div className='p-2 rounded-xl'>{platformIcons[listing.platform]}</div>
                <div>
                  <h2 className='flex items-center gap-2 text-xl font-semibold text-gray-800'>{listing.title}
                    <Link target='_blank' to={profileLink}>
                      <ArrowUpRightFromSquareIcon className='size-4 hover:text-indigo-500' />
                    </Link>
                  </h2>
                  <p className='text-sm text-gray-500'>@{listing.username} + {listing.platform?.charAt(0).toUpperCase() + listing.platform?.slice(1)}</p>
                  <div className='flex gap-2 mt-2'>
                    {listing.verified && (
                      <span className='flex items-center px-2 py-1 text-xs text-indigo-600 bg-indigo-50 rounded-b-md'>
                        <CheckCircle className='w-3 h-3 mr-1' />
                        Verified
                      </span>
                    )}
                    {listing.monetized && (
                      <span className='flex items-center px-2 py-1 text-xs text-green-600 bg-green-50 rounded-b-md'>
                        <DollarSign className='w-3 h-3 mr-1' />
                        Monetized
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className='text-right'>
                <h3 className='text-2xl font-bold text-gray-800'>
                  {currency}
                  {listing.price?.toLocaleString()}
                </h3>
                <p className='text-sm text-gray-500'>USD</p>
              </div>
            </div>
          </div>
          {/* Screenshot Section */}
          {images?.length > 0 && (
            <div className='mb-5 overflow-hidden bg-white border border-gray-200 rounded-xl'>
              <div className='p-4 text-left'>
                <h4 className='font-semibold text-gray-800'>Screenshots and proof</h4>
              </div>
              {/* Slider Container */}
              <div className='relative w-full aspect-video oveflow-hidden'>
                <div className='flex transition-transform duration-300 ease-in-out' style={{ transform: `translateX(-${current * 100}%)` }}>
                  {images.map((img, index) => (
                    <img className='w-full shrink-0' key={index} src={img} alt={`Screenshot ${index + 1}`} />
                  ))}
                </div>
                {/* Navigation buttons */}
                <button onClick={prevSlide} className='absolute p-2 text-gray-700 -translate-y-1/2 rounded-full bg-white/70 left-3 top-1/2 hover:bg-white'>
                  <ChevronLeftIcon className='w-5 h-5 text-gray-700' />
                </button>
                <button onClick={nextSlide} className='absolute p-2 text-gray-700 -translate-y-1/2 rounded-full bg-white/70 right-3 top-1/2 hover:bg-white'>
                  <ChevronRightIcon className='w-5 h-5 text-gray-700' />
                </button>
                {/* Dots Indicators */}
                <div className='absolute flex gap-2 -translate-x-1/2 bottom-3 left-1/2'>
                  {images.map((_, index) => (
                    <button onClick={() => setCurrent(index)} key={index} className={`w-2 h-2.5 rounded-full ${current === index ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Account Metrices */}
          <div className='mb-5 bg-white border border-gray-200 rounded-xl'>
            <div className='p-4 text-left border-b border-gray-100'>
              <h4 className='font-semibold text-gray-800'>Account Metrics</h4>
            </div>
            <div className='grid grid-cols-2 gap-4 p-4 text-left md:grid-cols-4'>
              <div>
                <Users className='w-5 h-5 mb-1 text-gray-400' />
                <p className='font-semibold text-gray-800'>
                  {listing.followers_count?.toLocaleString()}
                </p>
                <p className='text-xs text-gray-500'>Followers</p>
              </div>
              <div>
                <LineChart className='w-5 h-5 mb-1 text-gray-400' />
                <p className='font-semibold text-gray-800'>
                  {listing.engagement_rate}%
                </p>
                <p className='text-xs text-gray-500'>Engagement Rate</p>
              </div>
              <div>
                <Eye className='w-5 h-5 mb-1 text-gray-400' />
                <p className='font-semibold text-gray-800'>
                  {listing.monthly_views?.toLocaleString()}
                </p>
                <p className='text-xs text-gray-500'>Monthly Views</p>
              </div>
              <div>
                <Calendar className='w-5 h-5 mb-1 text-gray-400' />
                <p className='font-semibold text-gray-800'>
                  {new Date(listing.createdAt).toLocaleDateString()}
                </p>
                <p className='text-xs text-gray-500'>Listed</p>
              </div>
            </div>
          </div>
          {/* Description Section */}
          <div className='mb-5 bg-white border border-gray-200 rounded-xl'>
            <div className='p-4 text-left border-b border-gray-100'>
              <h4 className='font-semibold text-gray-800'>Description</h4>
            </div>
            <div className='p-4 text-sm text-left text-gray-600'>
              {listing.description}
            </div>
          </div>
          {/* Additional Details */}
          <div className='mb-5 bg-white border border-gray-200 rounded-xl'>
            <div className='p-4 text-left border-b border-gray-100'>
              <h4 className='font-semibold text-gray-800'>Additional Details</h4>
            </div>
            <div className='grid grid-cols-1 gap-6 p-4 text-sm text-left md:grid-cols-2'>
              <div>
                <p className='text-gray-500'>Niche</p>
                <p className='font-medium capitalize'>{listing.niche}</p>
              </div>
              <div>
                <p className='text-gray-500'>Primary Country</p>
                <p className='flex items-center font-medium capitalize'>
                  <MapPin className='mr-1 text-gray-400 size-4' />{listing.country}
                </p>
              </div>
              <div>
                <p className='text-gray-500'>Audience Age</p>
                <p className='font-medium'>
                  {listing.age_range}
                </p>
              </div>
              <div>
                <p className='text-gray-500'>Platform Verified</p>
                <p className='font-medium'>
                  {listing.platformAssured ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <p className='text-gray-500'>Monetization</p>
                <p className='font-medium'>
                  {listing.monetized ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <div>
                <p className='text-gray-500'>Status</p>
                <p className='font-medium capitalize'>
                  {listing.status}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Seller info & purchase options */}
        <div className='bg-white min-w-full md:min-w-[370px] rounded-xl border border-gray-200 p-5 max-md:mb-10'>
          <h4 className='mb-4 font-semibold text-left text-gray-800'>Seller Information</h4>
          <div className='flex items-center gap-3 mb-2'>
            <img src={listing.owner?.image} alt="sellerr logo" className='rounded-full size-10' />
            <div>
              <p className='font-medium text-left text-gray-800'>{listing.owner?.name}</p>
              <p className='text-sm text-gray-500'>{listing.owner?.email}</p>
            </div>
          </div>
          <div className='flex items-center justify-between mb-4 text-sm text-gray-600'>
            <p>Member since <span className='font-medium'>{new Date(listing.owner?.createdAt).toLocaleDateString()}</span></p>
          </div>
          <button onClick={loadChat} className='flex items-center justify-center w-full gap-2 py-2 text-sm font-medium text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700'>
            <MessageSquareMoreIcon className='size-4' /> Chat
          </button>
          {listing.isCredentialChanged && (
            <button onClick={purchaseAccount} className='flex items-center justify-center w-full gap-2 py-2 mt-2 text-sm font-medium text-white transition bg-purple-600 rounded-lg hover:bg-purple-700'>
              <ShoppingBagIcon className='size-4' /> Purchase
            </button>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className='p-4 text-center bg-white border-t border-gray-200 mt-28'>
        <p className='text-sm text-gray-500'>
          @ 2025 <span className='text-indigo-600'>Flipearn</span>. All rights reserved.
        </p>
      </div>
    </div>
  ) : (
    <div className='items-center justify-center h-screen'>
      <Loader2Icon className='text-indigo-600 size-7 animate-spin' />
    </div>
  )
}

export default ListingDetails

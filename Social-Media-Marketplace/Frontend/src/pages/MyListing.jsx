import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowDownCircleIcon, BanIcon, CheckCircle, Clock, CoinsIcon, DollarSign, Edit, Eye, EyeIcon, EyeOffIcon, LockIcon, Plus, StarIcon, TrashIcon, TrendingUp, Users, WalletIcon, XCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import { platformIcons } from '../assets/assets';
import CredentialSubmission from '../components/CredentialSubmission';
import WithdrawModal from '../components/WithdrawModal';

function MyListing() {

  const { userListings, balance } = useSelector((state) => state.listing);
  const currency = import.meta.env.VITE_CURRENCY || '$';

  const navigate = useNavigate();

  const [showCredentialSubmission, setShowCredentialSubmission] = useState(null);
  const [showWithdrawal, setShowWithdrawal] = useState(null);

  const totalValue = userListings.reduce((sum, listing) => sum + (listing.price || 0), 0);

  const activeListings = userListings.filter((listing) => listing.status === 'active').length;
  const soldListings = userListings.filter((listing) => listing.status === 'sold').length;

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className='size-3.5' />;
      case 'ban':
        return <BanIcon className='size-3.5' />;
      case 'sold':
        return <DollarSign className='size-3.5' />;
      case 'inactive':
        return <XCircle className='size-3.5' />;
      default:
        return <Clock className='size-3.5' />
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-800';
      case 'ban':
        return 'text-red-800';
      case 'sold':
        return 'text-indigo-800'
      case 'inactive':
        return 'text-gray-800';
      default:
        return 'text-gray-800';
    }
  };

  const toggleStatus = (listing) => {

  };

  const deleteListing = (listingId) => {

  };

  const markAsFeatured = (listingId) => {

  };

  return (
    <div className='px-6 pt-8 md:px-16 lg:px-24 xl:px-32'>
      {/* Header */}
      <div className='flex flex-col items-start justify-between mb-8 md:flex-row md:items-center'>
        <div>
          <h1 className='text-3xl font-bold text-left text-gray-800'>My Listings</h1>
          <p className='mt-1 text-gray-600'>Manage your social media account listings</p>
        </div>
        <button onClick={() => navigate('/create-listing')} className='flex items-center px-6 py-2 mt-4 space-x-2 font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 md:mt-0'>
          <Plus className='size-4' />
          <span>New Listing</span>
        </button>
      </div>
      {/* Stats */}
      <div className='grid grid-cols-1 gap-6 mb-8 md:grid-cols-4'>
        <StatCard title="Total Listings" value={userListings.length} icon={<Eye className='text-indigo-600 size-6' />} color="indigo" />
        <StatCard title="Active Listings" value={activeListings} icon={<CheckCircle className='text-green-600 size-6' />} color="green" />
        <StatCard title="Sold Listings" value={soldListings} icon={<TrendingUp className='text-red-600 size-6' />} color="red" />
        <StatCard title="Total Value" value={`${currency}${totalValue.toLocaleString()}`} icon={<DollarSign className='text-yellow-600 size-6' />} color="yellow" />
      </div>
      {/* Balanced Section */}
      <div className='flex flex-col justify-between gap-4 p-6 mb-10 bg-white border sm:flex-row xl:gap-20 rounded-xl border-b-gray-200'>
        {[
          { label: 'Earned', value: balance.earned, icon: WalletIcon },
          { label: 'Withdrawn', value: balance.withdrawn, icon: ArrowDownCircleIcon },
          { label: 'Available', value: balance.available, icon: CoinsIcon }
        ].map((item, index) => (
          <div onClick={() => item.label === 'Available' && setShowWithdrawal(true)} key={index} className='flex items-center justify-between flex-1 p-4 border border-gray-100 rounded-lg cursor-pointer'>
            <div className='flex items-center gap-3'>
              <item.icon className='w-6 h-6 text-gray-500' />
              <span className='font-medium text-gray-600'>{item.label}</span>
            </div>
            <span className='text-xl font-medium text-gray-700'>{currency}{item.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
      {/* Listing */}
      {userListings.length === 0 ? (
        <div className='p-16 text-center bg-white border border-gray-200 rounded-lg'>
          <div className='flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full'>
            <Plus className='w-8 h-8 text-gray-400' />
          </div>
          <h3 className='mb-2 text-xl font-medium text-gray-800'>No listings yet</h3>
          <p>Start by creating your first listing.</p>
          <button onClick={() => navigate('/create-listing')} className='px-4 py-2 mt-4 font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700'>Create First Listing</button>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {userListings.map((listing) => (
            <div key={listing.id} className='transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-lg shadow-gray-200/70'>
              <div className='p-6'>
                <div className='flex items-start justify-between gap-4 mb-4'>
                  {platformIcons[listing.platform]}
                  <div className='flex-1'>
                    <div className='flex items-start justify-between'>
                      <h3 className='text-lg font-semibold text-left text-gray-800'>{listing.title}</h3>
                      <div className='flex items-center gap-2'>
                        <div className='relative group'>
                          <LockIcon size={14} />
                          <div className='absolute top-0 right-0 invisible group-hover:visible pt-4.5 z-10'>
                            <div className='p-2 px-3 text-xs text-gray-600 bg-white border border-gray-200 rounded'>
                              {!listing.isCredentialSubmitted && (
                                <>
                                  <button onClick={() => setShowCredentialSubmission(listing)} className='flex items-center gap-2 text-nowrap'>Add Credentials</button>
                                  <hr className='my-2 border-gray-200' />
                                </>
                              )}
                              <button className='text-nowrap'>
                                status: {' '}
                                <span className={listing.isCredentialSubmitted ? listing.isCredentialVerified ? listing.isCredentialChanged ? 'text-green-600' : 'text-indigo-600' : 'text-slate-600' : 'text-red-600'}>
                                  {listing.isCredentialSubmitted ? listing.isCredentialVerified ? listing.isCredentialChanged ? 'Changed' : 'verified' : 'Submitted' : 'Not Submitted'}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                        {listing.status === 'active' && (
                          <StarIcon onClick={() => markAsFeatured(listing.id)} size={18} className={`text-yellow-500 cursor-pointer${listing.featured && ' fill-yellow-500'}`} />
                        )}
                      </div>
                    </div>
                    <p className='text-sm text-left text-gray-600'><span>@{listing.username}</span></p>
                  </div>
                </div>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-center space-x-2'>
                        <Users className='text-gray-400 size-4' />
                        <span>{formatNumber(listing.followers_count)} followers</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <TrendingUp className='text-gray-400 size-4' />
                        <span>{listing.engagement_rate}% engagement</span>
                      </div>
                    </div>
                    <span className={`flex items-center justify-end gap-1 ${getStatusColor(listing.status)}`}>
                      {getStatusIcon(listing.status)}{' '}<span>{listing.status}</span>
                    </span>
                  </div>
                  <div className='flex items-center justify-between pt-3 border-t border-gray-200'>
                    <span className='text-2xl font-bold text-gray-800'>
                      {currency}
                      {listing.price.toLocaleString()}
                    </span>
                    <div className='flex items-center space-x-2'>
                      {listing.status !== 'sold' && (
                        <button onClick={() => deleteListing(listing.id)} className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-500'>
                          <TrashIcon className='size-4' />
                        </button>
                      )}
                      <button onClick={() => navigate(`/edit-listing/${listing.id}`)} className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-indigo-600'>
                        <Edit className='size-4' />
                      </button>
                      <button onClick={toggleStatus(listing.id)} className='p-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:text-purple-600'>
                        {listing.status !== 'active' && (
                          <EyeOffIcon className='size-4' />
                        )}
                        {listing.status === 'active' && (
                          <EyeIcon className='size-4' />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      )}
      {showCredentialSubmission && (
        <CredentialSubmission listing={showCredentialSubmission} onClose={() => setShowCredentialSubmission(null)} />
      )}
      {showWithdrawal && (
        <WithdrawModal onClose={() => setShowWithdrawal(false)} />
      )}
      {/* Footer */}
      <div className='p-4 text-center bg-white border-t border-gray-200 mt-28'>
        <p className='text-sm text-gray-500'>
          @ 2025 <span className='text-indigo-600'>Flipearn</span>. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default MyListing

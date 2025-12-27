import React, { useEffect, useState } from 'react'
import { dummyOrders, platformIcons } from '../assets/assets';
import { toast } from 'react-hot-toast';
import { CheckCircle2, ChevronDown, ChevronUp, Loader2Icon, Copy } from 'lucide-react';
import { format } from 'date-fns';

function MyOrders() {

  const currency = import.meta.env.VITE_CURRENCY || '$';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandId, setExpandId] = useState(null);

  const fetchOrders = async () => {
    setOrders(dummyOrders);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const mask = (value, type) => {
    if (!value && value !== 0) return '';
    return type.toLowerCase() === 'password' ? '•'.repeat(8) : String(value);
  }

  const copy = async (txt) => {
    try {
      await navigator.clipboard.writeText(txt);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  if (loading) {
    return (
      <div className='h-[80vh] items-center justify-center'>
        <Loader2Icon className='text-indigo-600 size-7 animate-spin' />
      </div>
    )
  };

  if (!orders.length) {
    return (
      <div className='px-4 md:px-16 lg:px-24 xl:px-32'>
        <div className='max-w-2xl p-8 mx-auto text-center bg-white border border-gray-200 mt-14 rounded-xl'>
          <h3 className='text-lg font-semibold'>No orders found yet</h3>
          <p className='mt-2 text-sm text-gray-500'>You haven't purchased any listing yet.</p>
        </div>
      </div>
    )
  };

  return (
    <div className='px-4 py-6 md:px-16 lg:px-24 xl:px-32'>
      <h2 className='mb-6 text-2xl font-semibold text-left'>My Orders</h2>
      <div className='space-y-4'>
        {orders.map((order) => {
          const id = order.id;
          const listing = order.listing;
          const credential = order.credential;
          const isExpanded = expandId === id;

          return (
            <div key={id} className='flex flex-col max-w-4xl p-5 bg-white border rounded-lg boder-gray-200'>
              <div className='flex items-start flex-1 gap-4'>
                <div className='p-2 rounded-lg bg-gray-50 max-sm:hidden'>
                  {platformIcons[listing.platform]}
                </div>
                <div className='flex-1'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <h3 className='text-lg font-semibold'>{listing.title}</h3>
                      <p className='mt-1 text-sm text-left text-gray-500'>
                        @{listing.username} • <span className='capitalize'>{listing.platform}</span>
                      </p>
                      <div className='flex gap-2 mt-2'>
                        {listing.verified && (
                          <span className='flex items-center px-2 py-1 text-xs text-indigo-600 rounded-md bg-indigo-50'>
                            <CheckCircle2 className='w-3 h-3 mr-1' /> Verified
                          </span>
                        )}
                        {listing.monetized && (
                          <span className='flex items-center px-2 py-1 text-xs text-green-600 rounded-md bg-green-50'>
                            <span className='mr-1 text-xs font-medium'>$</span>Monetized
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-2xl font-bold'>
                        {currency}
                        {Number(order.amount).toLocaleString()}
                      </p>
                      <p className='text-sm text-gray-500'>USD</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end gap-2'>
                <button onClick={() => setExpandId(isExpanded ? null : id)} className='flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:shadow' aria-expanded={isExpanded}  >
                  {isExpanded ? (
                    <>
                      <ChevronUp className='size-4' /> Hide Credentials
                    </>
                  ) : (
                    <>
                      <ChevronDown className='size-4' /> view Credentials
                    </>
                  )}
                </button>
                <div className='mt-2 text-xs text-right text-gray-500'>
                  <div>
                    Credential Purchased: {format(new Date(order.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
              {isExpanded && (
                <div className='pt-4 mt-4 md:mt-0'>
                  <div className='space-y-2'>
                    {(credential.updatedCredential).map((cred) => (
                      <div key={cred.name} className='flex items-center justify-between gap-3 p-2 rounded-md bg-gray-50'>
                        <div>
                          <p className='text-sm font-medium text-gray-800 '>{cred.name}</p>
                          <p className='text-xs text-gray-500'>{cred.type}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                          <code className='font-mono text-sm'>
                            {mask(cred.value, cred.type)}
                          </code>
                          <button onClick={(e) => { e.stopPropagation(); copy(cred.value); }} className='px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:shadow' title='Copy'>
                            <Copy className='size-4' />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders

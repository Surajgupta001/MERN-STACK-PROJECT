import toast from 'react-hot-toast';
import { XIcon, CopyIcon } from 'lucide-react';

const WithdrawalDetail = ({ data, onClose }) => {
    const currency = import.meta.env.VITE_CURRENCY || '$';

    const copyToClipboard = ({ name, value }) => {
        navigator.clipboard.writeText(value || '');
        toast.success(`${name} copied to clipboard`);
    };

    const markAsWithdrawn = async () => {
        
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur z-100 sm:p-4'>
            <div className='bg-white sm:rounded-lg shadow-2xl w-full max-w-xl h-screen sm:h-[480px] flex flex-col'>
                {/* Header */}
                <div className='flex items-center justify-between p-4 text-white bg-linear-to-r from-indigo-600 to-indigo-400 sm:rounded-t-lg'>
                    <div className='flex-1 min-w-0'>
                        <h3 className='text-lg font-semibold truncate'>Withdrawal Request</h3>
                        <p className='text-sm text-indigo-100 truncate'>
                            Request by <span className='font-medium text-white'>{data.user?.name || '—'}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className='p-1 ml-4 transition-colors rounded-lg hover:bg-white/20'>
                        <XIcon className='w-5 h-5' />
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 p-4 overflow-y-auto text-gray-700'>
                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <p className='text-sm text-gray-500'>Amount</p>
                            <p className='text-lg font-medium'>{currency}{data.amount.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>Requested At</p>
                            <p className='font-medium'>{new Date(data.createdAt).toLocaleString('en-IN')}</p>
                        </div>
                    </div>

                    <div className='pt-3 mt-4 border-t border-gray-200'>
                        <h4 className='font-semibold'>Account Details</h4>
                        <div className='flex flex-col gap-2 mt-2'>
                            {data.account.length > 0 ? (
                                data.account.map((field, index) => (
                                    <div key={index} className='flex items-center w-full gap-3 group'>
                                        <div className='min-w-0'>
                                            <p className='text-sm text-gray-500'>{field.name}</p>
                                            <p className='font-medium truncate'>{field.value}</p>
                                        </div>
                                        <button onClick={() => copyToClipboard(field)} className='invisible p-1 rounded group-hover:visible hover:bg-gray-100' title={`Copy ${field.name}`}>
                                            <CopyIcon className='w-4 h-4' />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className='text-sm text-gray-500'>No account info available.</p>
                            )}
                        </div>
                    </div>

                    <div className='pt-3 mt-4 border-t border-gray-200'>
                        <h4 className='font-semibold'>User Summary</h4>
                        <div className='mt-2 text-sm text-gray-600'>
                            <div className='flex items-center gap-3'>
                                <img src={data.user?.image} alt={data.user?.name} className='object-cover w-10 h-10 border rounded-full' />
                                <div className='min-w-0'>
                                    <p className='font-medium truncate'>{data.user?.name || '—'}</p>
                                    <p className='text-xs text-gray-500 truncate'>{data.user?.email || '—'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {data.isWithdrawn && <div className='p-3 mt-4 text-green-700 border border-green-100 rounded bg-green-50'>This withdrawal is already marked as withdrawn.</div>}
                </div>

                {/* Footer actions */}
                {!data.isWithdrawn && <div className='flex items-center justify-end gap-2 p-4 border-t border-gray-200'>
                    <button onClick={markAsWithdrawn} className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md'>
                        Mark as withdrawn
                    </button>
                </div>}
            </div>
        </div>
    );
};

export default WithdrawalDetail;

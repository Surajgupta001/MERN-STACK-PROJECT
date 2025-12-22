import { X } from 'lucide-react';
import React, { useState } from 'react'

function WithdrawModal({ onClose }) {

    const [amount, setAmount] = useState('');
    const [account, setAccount] = useState([
        {type: 'text', name: 'Account Holder Name', value: ''},
        {type: 'text', name: 'Bank Name', value: ''},
        {type: 'number', name: 'Account Number', value: ''},
        {type: 'text', name: 'Account Type', value: ''},
        {type: 'text', name: 'SWIFT', value: ''},
        {type: 'text', name: 'Branch', value: ''},
    ]);

    const handleSubmission = async (e) => {
        e.preventDefault();
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black/70 backdrop-blur z-100 sm:p-4'>
            <div className='flex flex-col w-full h-screen max-w-lg bg-white shadow-2xl sm:rounded-lg sm:h-auto'>
                {/* Header  */}
                <div className='flex items-center justify-between p-4 text-white bg-linear-to-r from-indigo-600 to-indigo-400 sm:rounded-t-lg'>
                    <div className='flex-1 min-w-0'>
                        <h3 className='text-lg font-semibold text-left truncate'>Withdraw Funds</h3>
                    </div>
                    <button onClick={onClose} className='p-1 ml-4 transition-colors rounded-lg hover:bg-white/20 hover:bg-opacity-20'>
                        <X className='w-5 h-5' />
                    </button>
                </div>
                {/* Form  */}
                <form onSubmit={handleSubmission} className='flex flex-col gap-4 p-4 overflow-y-scroll'>
                    <div className='grid grid-cols-[1.5fr_3fr] items-center gap-3 w-full text-left'>
                        <label className='text-sm font-medium text-left text-gray-800'>Amount</label>
                        <input onChange={(e) => setAmount(e.target.value)} type='number' value={amount} className='w-full px-2 py-1.5 text-sm border border-gray-300 rounded outline-indigo-400' required/>
                    </div>
                    {account.map((field, index) => (
                        <div key={index} className='grid grid-cols-[1.5fr_3fr] items-center gap-3 w-full'>
                            <label className='text-sm font-medium text-left text-gray-800'>{field.name}</label>
                            <input type={field.type} value={field.value} onChange={(e) => setAccount((prev) => prev.map((c, i) => (i === index ? {...c, value: e.target.value} : c)))} className='w-full px-2 py-1.5 text-sm border border-gray-300 rounded outline-indigo-400' required />
                        </div>
                    ))}
                    {/* Submit button */}
                    <button type='submit' className='self-start px-6 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700'>Apply for Withdrawal</button>
                </form>
            </div>
        </div>
    )
}

export default WithdrawModal
 
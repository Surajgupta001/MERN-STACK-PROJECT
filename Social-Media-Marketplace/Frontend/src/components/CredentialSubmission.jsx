import { CirclePlus, X } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

function CredentialSubmission({ onClose, listing }) {

    const [newField, setNewField] = useState('');
    const [credentials, setCredentials] = useState([
        { type: 'email', name: 'Email Addresses', value: '' },
        { type: 'password', name: 'Password', value: '' },
    ]);

    const handleAddField = () => {
        const name = newField.trim();
        if (!name) return toast('Please enter a field name');
        setCredentials((prev) => [...prev, { type: 'text', name, value: '' }]);
        setNewField('');
    };

    const handleSubmission = async (e) => {
        e.preventDefault();
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black/70 backdrop-blur z-100 sm:p-4'>
            <div className='flex flex-col w-full h-screen max-w-lg bg-white shadow sm:rounded-lg-2xl sm:h-80'>
                {/* Header */}
                <div className='flex items-center justify-between p-4 text-white bg-linear-to-r from-indigo-600 to-indigo-400 sm:rounded-t-lg'>
                    <div className='flex-1 min-w-0'>
                        <h3 className='text-left'>{listing?.title}</h3>
                        <p className='text-left'>Adding Credentials for {listing?.username} on {listing?.platform}</p>
                    </div>
                    <button onClick={onClose} className='p-1 ml-4 transition-colors rounded-lg hover:bg-white/20 hover:bg-opacity-20'>
                        <X className='w-5 h-5' />
                    </button>
                </div>
                {/* form */}
                <form onSubmit={handleSubmission} className='flex flex-col items-start gap-4 p-4 overflow-scroll'>
                    {credentials.map((cred, index) => (
                        <div key={cred.type} className='grid grid-cols-[2fr_3fr_1fr] items-center gap-2'>
                            <label className='text-sm font-medium text-left text-gray-800'>{cred.name}</label>
                            <input type="text" value={cred.value} onChange={(e) => setCredentials((prev) => prev.map((c, i) => (i === index ? { ...c, value: e.target.value } : c)))} className='w-full px-2 py-1.5 text-sm border border-gray-300 rounded outline-indigo-400' />
                            <X onClick={() => setCredentials((prev) => prev.filter((_, i) => i !== index))} className='w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700' />
                        </div>
                    ))}
                    {/* Add more fields */}
                    <div className='flex items-center gap-2'>
                        <input type="text" value={newField} onChange={(e) => setNewField(e.target.value)} placeholder='Field Name...' className='border-b border-gray-200 outline-none' />
                        <button onClick={handleAddField} className='flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-700'>
                            <CirclePlus className='w-5 h-5' />
                        </button>
                    </div>
                    {/* Submit button */}
                    <button type='submit' className='px-6 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700'>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default CredentialSubmission

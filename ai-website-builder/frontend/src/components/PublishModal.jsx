import { XIcon } from 'lucide-react';
import React from 'react'
import toast from 'react-hot-toast';

function PublishModal({ publishUrl, onClose }) {

    const handleCopyLink = () => {
        if (!publishUrl) return;
        navigator.clipboard.writeText(publishUrl)
        toast.success("Public link copied to clipboard!");
    };

    return (
        <div className='absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs'>
            <div className='relative w-full max-w-md p-6 mx-4 bg-white border shadow-lg border-zinc-200 rounded-xl'>
                <button onClick={onClose} className='absolute cursor-pointer to-4 right-4 text-zinc-400 hover:text-zinc-900'>
                    <XIcon size={16} />
                </button>
                <div className='mb-6'>
                    <h3 className='mb-1 text-lg font-medium text-zinc-900'>Your Website is live!</h3>
                    <p className='text-sm text-zinc-500'>Anyone with the link below can view your published website.</p>
                </div>
                <div className='space-y-4'>
                    <div>
                        <label className='block text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5'>
                            Published Link
                        </label>
                        <input type="text" readOnly value={publishUrl} className='w-full px-0 py-2 text-sm bg-transparent border-b outline-none border-zinc-200 text-zinc-900' />
                    </div>
                    <div className='flex gap-2 pt-2'>
                        <button onClick={handleCopyLink} className='flex-1 py-2 text-xs font-medium text-center text-white rounded-lg cursor-pointer bg-zinc-950 hover:bg-zinc-800'>
                            Copy Link
                        </button>
                        <button onClick={() => window.open(publishUrl, '_blank')} className='flex-1 py-2 text-xs font-medium text-center border rounded-lg cursor-pointer border-zinc-200 hover:bg-zinc-50'>
                            Open Site
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublishModal
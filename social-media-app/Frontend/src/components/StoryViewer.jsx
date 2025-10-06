import { BadgeCheck, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function StoryViewer({ viewStory, setViewStory }) {

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let timer;
        let progressInterval;

        if (viewStory && viewStory.media_type !== 'video') {
            setProgress(0);

            const duration = 10000; // 10 seconds for image and text stories
            const setTime = 100; // Update every 100ms
            let elapsed = 0; // Time elapsed

            // Update progress bar
            progressInterval = setInterval(() => {
                elapsed += setTime;
                setProgress((elapsed / duration) * 100);
            }, setTime);

            // Close story after duration
            timer = setTimeout(() => {
                setViewStory(null);
            }, duration);
        }

        return () => {
            if (timer) clearTimeout(timer);
            if (progressInterval) clearInterval(progressInterval);
        };

    }, [viewStory, setViewStory]);

    const handleClose = () => {
        setViewStory(null);
    };

    if (!viewStory) return null;

    const renderContent = () => {
        switch (viewStory.media_type) {
            case 'image':
                return (
                    <img src={viewStory.media_url} alt="" className='object-contain max-w-full max-h-screen' />
                );
            case 'video':
                return (
                    <video onEnded={() => setViewStory(null)} src={viewStory.media_url} alt="" className='max-h-screen' controls autoPlay />
                );
            case 'text':
                return (
                    <div className='flex items-center justify-center w-full h-full p-8 text-2xl text-center text-white'>{viewStory.content}</div>
                );
            default:
                return null;
        }
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center h-screen bg-black bg-opacity-90 z-110' style={{ backgroundColor: viewStory.media_type === 'text' ? viewStory.background_color : '#000000' }}>
            {/* Progress Bar */}
            <div className='absolute top-0 left-0 w-full h-1 bg-gray-700'>
                <div className='h-full transition-all duration-100 bg-white linear' style={{ width: `${progress}%` }}></div>
            </div>
            {/* User info - Top left */}
            <div className='absolute flex items-center p-2 px-4 space-x-3 rounded top-4 left-4 sm:p-4 sm:px-8 backdrop-blur-2xl bg-black/50'>
                <img src={viewStory.user?.profile_picture} alt="" className='object-cover border border-white rounded-full size-7 sm:size-8' />
                <div className='flex items-center gap-1.5 text-white'>
                    <span>{viewStory.user?.full_name}</span>
                    <BadgeCheck size={18} />
                </div>
            </div>
            {/* Close Button */}
            <button onClick={handleClose} className='absolute text-3xl font-bold text-white top-4 right-4 focus:outline-none'>
                <X className='w-8 h-8 transition cursor-pointer hover:scale-110' />
            </button>
            {/* Contain Wrapper */}
            <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
                {renderContent()}
            </div>
        </div>
    )
}

export default StoryViewer

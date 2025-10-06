import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

function StoryModel({ setShowModel, fetchStories }) {

    const bgColors = ['#4f46e5', '#7c3aed', '#db2777', '#e11d48', '#ca8a04', '#0d9488'];

    const [mode, setMode] = useState('text');
    const [background, setBackground] = useState(bgColors[0]);
    const [text, setText] = useState('');
    const [media, setMedia] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleMediaUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedia(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCreateStory = async () => {
        
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center min-h-screen p-4 text-white z-110 bg-black/80 backdrop-blur'>
            <div className='w-full max-w-md'>
                <div className='flex items-center justify-between mb-4 text-center'>
                    <button onClick={() => setShowModel(false)} className='p-2 text-white cursor-pointer'>
                        <ArrowLeft />
                    </button>
                    <h2 className='text-lg font-semibold'>Create Story</h2>
                    <span className='w-10'></span>
                </div>
                <div className='relative flex items-center justify-center rounded-lg h-96' style={{ backgroundColor: background }}>
                    {mode === 'text' && (
                        <textarea onChange={(e) => setText(e.target.value)} value={text} className='w-full h-full p-6 text-lg text-white bg-transparent resize-none focus:outline-none' placeholder="What's on your mind?" />
                    )}
                    {mode === 'media' && previewUrl && (
                        media?.type.startsWith('image') ? (
                            <img src={previewUrl} alt="" className='object-contain max-h-full' />
                        ) : (
                            <video src={previewUrl} className='object-contain max-h-full' controls />
                        )
                    )}
                </div>
                <div className='flex gap-2 mt-4'>
                    {bgColors.map((color) => (
                        <button onClick={() => setBackground(color)} key={color} className='w-6 h-6 rounded-full cursor-pointer ring' style={{ backgroundColor: color }} />
                    ))}
                </div>
                <div className='flex gap-2 mt-4'>
                    <button onClick={() => { setMode('text'); setMedia(null); setPreviewUrl(null); }} className={`flex-1 flex items-center justify-center gap-2 p-2 rounded ${mode === 'text' ? 'bg-white text-black' : 'bg-zinc-800'} cursor-pointer`}>
                        <TextIcon size={18} />
                        Text
                    </button>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded ${mode === 'media' ? 'bg-white text-black' : 'bg-zinc-800'} cursor-pointer`}>
                        <input onChange={(e) => { handleMediaUpload(e); setMode('media'); }} type='file' accept='image/*,video/*' className='hidden' />
                        <Upload size={18} /> Photo/Video
                    </label>
                </div>
                <button onClick={() => toast.promise(handleCreateStory(), {
                    loading: 'Saving...',
                    success: <p>Story Added</p>,
                    error: (error) => <p>{error.message}</p>,
                })} className='flex items-center justify-center w-full gap-2 py-3 mt-4 text-white transition rounded cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95'>
                    <Sparkle size={18} /> Create Story
                </button>
            </div>
        </div>
    )
}

export default StoryModel

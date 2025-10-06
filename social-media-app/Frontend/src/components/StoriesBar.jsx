import React, { useEffect, useState } from 'react'
import { dummyStoriesData } from '../assets/assets';
import { Plus } from 'lucide-react';
import moment from 'moment';
import StoryModel from './StoryModel';
import StoryViewer from './StoryViewer';

function StoriesBar() {

    const [stories, setStories] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const [viewStory, setViewStory] = useState(null);

    const fetchStories = async () => {
        setStories(dummyStoriesData);
    };

    useEffect(() => {
        fetchStories();
    }, []);

    return (
        <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl overflow-x-auto no-scrollbar px-4'>
            {/* Horizontal scroll row */}
            <div className='flex gap-5 py-2 w-max'>
                {/* Add Story Card */}
                <div onClick={() => setShowModel(true)} className='relative w-28 aspect-[3/4] rounded-lg shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white'>
                    <div className='flex flex-col items-center justify-center h-full p-4'>
                        <div className='flex items-center justify-center mb-3 bg-indigo-500 rounded-full size-10'>
                            <Plus className='w-5 h-5 text-white' />
                        </div>
                        <p className='text-sm font-medium text-center text-slate-700'>Create Story</p>
                    </div>
                </div>
                {/* Story Cards */}
                {stories.map((story, index) => (
                    <div onClick={() => setViewStory(story)} key={index} className='relative w-28 aspect-[3/4] rounded-lg shadow cursor-pointer hover:shadow-lg transition-all bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 overflow-hidden'>
                        <img src={story.user.profile_picture} alt='' className='absolute z-10 rounded-full shadow size-8 top-3 left-3 ring ring-gray-100' />
                        <p className='absolute text-xs text-white/70 top-14 left-3 right-2 line-clamp-3'>{story.content}</p>
                        <p className='absolute z-10 text-[10px] text-white/80 bottom-1 right-2'>{moment(story.createdAt).fromNow()}</p>
                        {
                            story.media_type !== 'text' && (
                                <div className='absolute inset-0 overflow-hidden bg-black rounded-lg z-1'>
                                    {
                                        story.media_type === 'image' ?
                                            <img src={story.media_url} alt="" className='object-cover w-full h-full transition duration-500 hover:scale-110 opacity-70 hover:opacity-80' />
                                            :
                                            <video src={story.media_url} className='object-cover w-full h-full transition duration-500 hover:scale-110 opacity-70 hover:opacity-80' />
                                    }
                                </div>
                            )
                        }
                    </div>
                ))}
            </div>
            {/* Add Story Model */}
            {showModel && <StoryModel setShowModel={setShowModel} fetchStories={fetchStories} />}
            {/* Story Viewer */}
            {viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />}
        </div>
    )
}

export default StoriesBar

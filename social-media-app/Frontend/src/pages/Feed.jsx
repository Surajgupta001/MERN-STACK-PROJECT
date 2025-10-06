import React, { useEffect, useState } from 'react'
import { assets, dummyPostsData } from '../assets/assets';
import Loading from '../components/Loading';
import StoriesBar from '../components/StoriesBar';
import PostCard from '../components/PostCard';
import RecentMessages from '../components/recentMessages';

function Feed() {

    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFeeds = async () => {
        setFeed(dummyPostsData);
        setLoading(false);
    };

    useEffect(() => {
        fetchFeeds();
    }, []);

    return !loading ? (
    <div className='flex items-start justify-center h-full gap-5 py-10 pr-4 overflow-y-scroll no-scrollbar md:pr-5 xl:pr-7 xl:gap-7'>
            {/* Stories and Post list */}
            <div>
                <StoriesBar />
                <div className='p-4 space-y-6'>
                    {feed.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            </div>
            {/* Right Sidebar */}
            <div className='sticky top-0 hidden mr-1 lg:block md:mr-3 xl:mr-5'>
                <div className='inline-flex flex-col max-w-xs gap-2 p-4 text-xs bg-white rounded-md shadow'>
                    <h3 className='font-semibold text-slate-800'>Sponsored</h3>
                    <img src={assets.sponsored_img} alt="" className='rounded-md w-75 h-50' />
                    <p className='text-slate-600'>Email marketing</p>
                    <p className='text-slate-400'>Supercharge your marketing with a powerful, easy-to-use platform built for results.</p>
                </div>
                <RecentMessages />
            </div>
        </div>
    ) : (
        <Loading />
    )
}

export default Feed

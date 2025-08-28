import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets} from '../assets/assets';
import Navbar from '../components/Navbar';
import Moment from 'moment'
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

function Blog() {

    const { id } = useParams();

    const { axios } = useAppContext();

    const [data, setData] = useState(null);
    const [comments, setComments] = useState([]);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');

    const fetchBlogData = async () => {
        try {

            const { data } = await axios.get(`/api/blog/${id}`);
            data.success ? setData(data.blog) : toast.error(data.message);
            
        } catch (error) {
            console.error(error);
            toast.error(error.message)
        }
    };

    const fetchComments = async () => {
        try {

            const { data } = await axios.post('/api/blog/comments', { blogId: id });

            if (data.success) {
                setComments(data.comments);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const addComment = async (e) => {
        e.preventDefault();
        try {

            const { data } = await axios.post('/api/blog/add-comment', { 
                blog: id,
                name,
                content
            });

            if (data.success) {
                toast.success(data.message);
                setName('');
                setContent('');
            } else {
                toast.error(data.message);
            }
            
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchBlogData();
        fetchComments();
    }, []);

    return data ? (
        <div className='relative'>
            <img className='absolute opacity-50 -top-50 -z-1' src={assets.gradientBackground} alt="" />
            <Navbar />
            <div className='mt-20 text-center text-gray-600'>
                <p className='py-4 font-medium text-primary'>Published on {Moment(data.createdAt).format('MMMM Do YYYY')}</p>
                <h1 className='max-w-2xl mx-auto text-2xl font-semibold text-gray-800 sm:text-5xl'>{data.title}</h1>
                <h2 className='max-w-lg mx-auto my-5 truncate'>{data.subTitle}</h2>
                <p className='inline-block px-4 py-1 mb-6 text-sm font-medium border rounded-md border-primary/35 bg-primary/5 text-primary'>Michael Brown</p>
            </div>
            <div className='max-w-5xl mx-5 my-10 mt-6 md:mx-auto'>
                <img className='mb-5 rounded-3xl' src={data.image} alt="" />
                <div className='max-w-3xl mx-auto rich-text' dangerouslySetInnerHTML={{ __html: data.description }}></div>
                {/* Comment Section */}
                <div className='max-w-3xl mx-auto mb-10 mt-14'>
                    <p>Comments ({comments.length})</p>
                    <div className='flex flex-col gap-4'>
                        {comments.map((item, index) => (
                            <div key={index} className='relative max-w-xl p-4 text-gray-600 border rounded bg-primary/2 border-primary/5'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <img src={assets.user_icon} alt="" className='w-6' />
                                    <p className='font-medium'>{item.name}</p>
                                </div>
                                <p className='max-w-md ml-8 text-sm'>{item.content}</p>
                                <div className='absolute flex gap-2 text-xs right-4 bottom-3 item-center'>{Moment(item.createdAt).fromNow()}</div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Add Comment Section */}
                <div className='max-w-3xl mx-auto'>
                    <p className='mb-4 font-semibold'>Add Your Comment</p>
                    <form onSubmit={addComment} className='flex flex-col items-start max-w-lg gap-4'>
                        <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Write Your Name...' required className='w-full p-2 border border-gray-300 rounded-md outline-none' />
                        <textarea onChange={(e) => setContent(e.target.value)} value={content} placeholder='Write Your Comment...' className='w-full h-48 p-2 border border-gray-300 rounded-md outline-none'></textarea>
                        <button type='submit' className='p-2 px-8 text-white transition-all rounded-md cursor-pointer bg-primary hover:scale-102'>Submit</button>
                    </form>
                </div>
                {/* Share Buttons */}
                <div className='max-w-3xl mx-auto my-24'>
                    <p className='my-4 font-semibold'>Share this articles on social media</p>
                    <div className='flex cursor-pointer'>
                        <img src={assets.facebook_icon} width={50} alt="" />
                        <img src={assets.twitter_icon} width={50} alt="" />
                        <img src={assets.googleplus_icon} width={50} alt="" />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    ) :
        <Loader />
}

export default Blog

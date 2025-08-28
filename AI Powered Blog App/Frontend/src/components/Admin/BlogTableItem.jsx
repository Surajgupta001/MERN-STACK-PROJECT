import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

function BlogTableItem({blog, fetchBlogs, index}) {

    const {title, createdAt } = blog;
    const Blogdate = new Date(createdAt);

    const { axios } = useAppContext();

    const deleteBlog = async () => {
        const confirm = window.confirm('Are you sure you want to delete this blog?');
        if(!confirm) return;
        try {
            const { data } = await axios.post('/api/blog/delete', { id: blog._id });
            if(data.success) {
                toast.success(data.message);
                fetchBlogs();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    const togglePublish = async () => {
        try {
            const { data } = await axios.post('/api/blog/toggle-publish', { id: blog._id });
            if(data.success) {
                toast.success(data.message);
                fetchBlogs();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    return (
        <tr className='border-gray-300 border-y'>
            <th className='px-2 py-4'>{index}</th>
            <td className='px-2 py-4'>{title}</td>
            <td className='px-2 py-4 max-sm:hidden'>{Blogdate.toDateString()}</td>
            <td className='px-2 py-4 max-sm:hidden'>
                <p className={`${blog.isPublished ? 'text-green-600' : 'text-orange-700'}`}>{blog.isPublished ? 'Published' : 'Unpublished'}</p>
            </td>
            <td className='flex gap-3 px-2 py-4 text-xs'>
                <button onClick={togglePublish} className='border px-2 py-0.5 mt-1 rounded cursor-pointer'>{blog.isPublished ? 'Unpublish' : 'Publish'}</button>
                <img onClick={deleteBlog} src={assets.cross_icon} alt="" className='w-8 transition-all cursor-pointer hover:scale-110'/>
            </td>
        </tr>
    )
}

export default BlogTableItem

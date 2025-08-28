import React, { useEffect, useState } from 'react'
import BlogTableItem from '../../components/Admin/BlogTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

function ListBlog() {

    const [blogs, setBlogs] = useState([]);
    const { axios } = useAppContext();

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get('/api/admin/blogs');
            
            if(data.success) {
                setBlogs(data.blogs);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <div className='flex-1 px-5 pt-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
            <h1>All Blogs</h1>
            <div className='relative max-w-4xl mt-4 overflow-x-auto bg-white rounded-md shadow scrollbar-hide h-4/5'>
                <table className='w-full text-sm text-gray-500'>
                    <thead className='text-xs text-left text-gray-600 uppercase'>
                        <tr>
                            <th scope='col' className='px-3 py-4 xl-px-6'>#</th>
                            <th scope='col' className='px-3 py-4'>Blog Title</th>
                            <th scope='col' className='px-3 py-4 max-sm:hidden'>Date</th>
                            <th scope='col' className='px-3 py-4 max-sm:hidden'>Status</th>
                            <th scope='col' className='px-3 py-4'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((blog, index) => {
                            return <BlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={index + 1} />
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListBlog

import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

function CommentTableItem({ comment, fetchComments }) {

    const { blog, createdAt, _id } = comment;
    const BlogDate = createdAt ? new Date(createdAt) : null;
    const blogTitle = blog?.title || 'Blog removed';

    const { axios } = useAppContext();

    const approveComment = async () => {
        try {
            const { data } = await axios.post('/api/admin/approve-comment', { id: _id })
            if(data.success) {
                toast.success(data.message);
                fetchComments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        }
    };
    
    const deleteComment = async () => {
        try {
            const confirm = window.confirm('Are you sure you want to delete this comment?');
            if(!confirm) return;
            const { data } = await axios.post('/api/admin/delete-comment', { id: _id })
            if(data.success) {
                toast.success(data.message);
                fetchComments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        }
    };

    return (
        <tr className='border-gray-300 order-y'>
            <td className='px-6 py-4'>
                <b className='font-medium text-gray-600'>Blog</b> : {blogTitle}
                <br />
                <br />
                <b className='font-medium text-gray-600'>Name</b> : {comment.name}
                <br />
                <b className='font-medium text-gray-600'>Comment</b> : {comment.content}
            </td>
            <td className='px-5 py-4 max-sm:hidden'>
                {BlogDate ? BlogDate.toLocaleDateString() : '--'}
            </td>
            <td className='px-6 py-4'>
                <div className='inline-flex items-center gap-4'>
                    {
                        !comment.isApproved ?
                            <img onClick={approveComment} src={assets.tick_icon} alt="" className='w-5 transition-all cursor-pointer hover:scale-110' />
                            : <p className='px-3 py-1 text-sm text-green-600 bg-green-100 border border-green-600 rounded-md'>Approved</p>
                    }
                    <img onClick={deleteComment} src={assets.bin_icon} alt="" className='w-5 transition-all cursor-pointer hover:scale-110' />
                </div>
            </td>
        </tr>
    )
}

export default CommentTableItem

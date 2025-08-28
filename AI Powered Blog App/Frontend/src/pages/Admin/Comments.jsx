import React, { useEffect, useState } from 'react'
import CommentTableItem from '../../components/Admin/CommentTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

function Comments() {

    const [comments, setComments] = useState([]);
    const [filter, setFilter] = useState('Not Approved');

    const { axios } = useAppContext();

    const fetchComments = async () => {
        try {
            const { data } = await axios.get('/api/admin/comments');
            data.success ? setComments(data.comments) : toast.error(data.message);
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <div className='flex-1 px-5 pt-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
            <div className='flex items-center justify-between max-w-3xl'>
                <h1>Comments</h1>
                <div className='flex gap-4'>
                    <button className={`shadow-cutom-sm border rounded-md px-4 py-1 cursor-pointer text-xs ${filter === 'Approved' ? 'text-primary' : 'text-gray-700'}`} onClick={() => setFilter('Approved')}>Approved</button>
                    <button className={`shadow-cutom-sm border rounded-md px-4 py-1 cursor-pointer text-xs ${filter === 'Not Approved' ? 'text-primary' : 'text-gray-700'}`} onClick={() => setFilter('Not Approved')}>Not Approved</button>
                </div>
            </div>
            <div className='relative max-w-3xl mt-4 overflow-x-auto bg-white rounded-lg shadow h-4/5 scrollbar-hide'>
                <table className='w-full text-sm text-gray-500'>
                    <thead className='text-xs text-left text-gray-700 uppercase'>
                        <tr>
                            <th scope='col' className='px-6 py-3'>Blog Title & Comment</th>
                            <th scope='col' className='px-6 py-3 max-sm:hidden'>Date</th>
                            <th scope='col' className='px-6 py-3'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.filter((comment) => {
                            if (filter === 'Approved') {
                                return comment.isApproved === true;
                            } else {
                                return comment.isApproved === false;
                            }
                        }).map((comment, index) => <CommentTableItem key={comment._id} comment={comment} index={index + 1} fetchComments={fetchComments} />)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Comments

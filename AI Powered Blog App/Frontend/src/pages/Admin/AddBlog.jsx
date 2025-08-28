import React, { useEffect, useRef, useState } from 'react'
import { assets, blogCategories } from '../../assets/assets'
import Quill from 'quill'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { parse } from 'marked'

function AddBlog() {

    const { axios } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);

    const editorRef = useRef(null);
    const quillRef = useRef(null);

    const [image, setImage] = useState(false);
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [category, setCategory] = useState('Startup');
    const [isPublished, setIsPublished] = useState(false);

    const generateContent = async () => {
        if (!title) return toast.error('Please enter a title');
        try {
            setLoading(true);
            const { data } = await axios.post('/api/blog/generate', { prompt: title });
            if (data.success) {
                quillRef.current.root.innerHTML = parse(data.content);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            setIsAdding(true);

            const blog = {
                title,
                subTitle,
                description: quillRef.current.root.innerHTML,
                category,
                isPublished
            }

            const formData = new FormData();
            formData.append('blog', JSON.stringify(blog));
            formData.append('image', image);

            const { data } = await axios.post('/api/blog/add', formData);

            if (data.success) {
                toast.success(data.message);
                setImage(false);
                setTitle('');
                quillRef.current.root.innerHTML = '';
                setCategory('Startup');
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        } finally {
            setIsAdding(false);
        }
    }

    useEffect(() => {
        // Initiate Quill only once
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
            });
        }
    }, []);

    return (
        <form onSubmit={onSubmitHandler} className='flex-1 h-full overflow-scroll text-gray-600 bg-blue-50/50'>
            <div className='w-full max-w-3xl p-4 bg-white rounded shadow md:p-10 sm:m-10'>
                <p>Upload thumbnail</p>
                <label htmlFor="image">
                    <img className='h-16 mt-2 rounded cursor-pointer' src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
                    <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden required />
                </label>
                <p className='mt-4'>Blog title</p>
                <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' className='w-full max-w-lg p-2 mt-2 border border-gray-300 rounded outline-none' placeholder='Enter blog title' required />
                <p className='mt-4'>Blog subtitle</p>
                <input onChange={(e) => setSubTitle(e.target.value)} value={subTitle} type='text' className='w-full max-w-lg p-2 mt-2 border border-gray-300 rounded outline-none' placeholder='Enter blog subtitle' required />
                <p className='mt-4'>Blog Descriptions</p>
                <div className='relative max-w-lg pt-2 pb-16 h-74 sm:pb-10'>
                    <div ref={editorRef}></div>
                    {loading && (
                        <div className='absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center mt-2 bg-black/10'>
                            <div className='w-8 h-8 border-2 rounded-full border-t-white animate-spin'></div>
                        </div>
                    )}
                    <button disabled={loading} onClick={generateContent} type='button' className='absolute ml-2 text-xs text-white bottom-1 right-2 bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer'>Generate with AI</button>
                </div>
                <div>
                    <p className='mt-4'>Blog Category</p>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className='px-3 py-2 mt-2 text-gray-500 border border-gray-300 rounded outline-none'>
                        <option value="">Select Category</option>
                        {blogCategories.map((item, index) => {
                            return <option key={index} value={item}>{item}</option>
                        })}
                    </select>
                    <div>
                        <p>Publish Now</p>
                        <input type='checkbox' checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className='scale-125 cursor-pointer' />
                    </div>
                    <button disabled={isAdding} type='submit' className='w-40 h-10 mt-8 text-sm text-white rounded-md cursor-pointer bg-primary'>{isAdding ? 'Adding...' : 'Add Blog'}</button>
                </div>
            </div>
        </form>
    )
}

export default AddBlog

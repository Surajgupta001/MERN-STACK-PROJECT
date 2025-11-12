import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, Plus, TrashIcon, UploadCloud, UploadCloudIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';
import pdfToText from 'react-pdftotext';

function Dashboard() {

    const { token } = useSelector(state => state.auth);

    const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];
    const [allResumes, setAllResumes] = useState([]);
    const [showCreateResume, setShowCreateResume] = useState(false);
    const [showUploadResume, setShowUploadResume] = useState(false);
    const [title, setTitle] = useState("");
    const [resume, setResume] = useState(null);
    const [editResumeId, setEditResumeId] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const loadAllResumes = async () => {
        try {
            const { data } = await api.get('/api/v1/users/resumes', {
                headers: { Authorization: token }
            })
            setAllResumes(data.resumes);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const createResume = async (e) => {
        try {
            e.preventDefault();
            const { data } = await api.post('/api/v1/resumes/create', { title }, {
                headers: { Authorization: token }
            })
            setAllResumes([...allResumes, data.resume]);
            setTitle('');
            setShowCreateResume(false);
            navigate(`/app/builder/${data.resume._id}`)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const uploadResume = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const resumeText = await pdfToText(resume);
            const { data } = await api.post('/api/v1/ai/upload-resume', { title, resumeText }, {
                headers: { Authorization: token }
            })
            setTitle('');
            setResume(null);
            setShowUploadResume(false);
            navigate(`/app/builder/${data.resumeId}`)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
        setIsLoading(false);
    };

    const editTitle = async (e) => {
        try {
            e.preventDefault();
            const { data } = await api.put(`/api/v1/resumes/update`, {
                resumeId: editResumeId,
                resumeData: { title }
            }, {
                headers: { Authorization: token }
            })
            setAllResumes(allResumes.map(resume => resume._id === editResumeId ? { ...resume, title } : resume));
            setEditResumeId('');
            setTitle('');
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const deleteResume = async (resumeId) => {
        try {
            const confirm = window.confirm("Are you sure you want to delete this resume?");
            if (confirm) {
                const { data } = await api.delete(`/api/v1/resumes/delete/${resumeId}`, {
                    headers: { Authorization: token }
                })
                setAllResumes(allResumes.filter(resume => resume._id !== resumeId));
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        loadAllResumes();
    }, [])

    return (
        <div>
            <div className='px-4 py-8 mx-auto max-w-7xl'>
                <p className='mb-6 text-2xl font-medium text-transparent bg-linear-to-r from-slate-600 to-slate-700 bg-clip-text sm:hidden'>Welcome, Joe Doe</p>
                <div className='flex gap-4'>
                    <button onClick={() => setShowCreateResume(true)} className='flex flex-col items-center justify-center w-full h-48 gap-2 transition-all duration-300 bg-white border border-dashed rounded-lg cursor-pointer sm:max-w-36 text-slate-600 border-slate-300 group hover:border-indigo-500 hover:shadow-lg'>
                        <Plus className='transition-all duration-300 w-11 h-11 p-2.5 bg-linear-to-r from-indigo-500 to-indigo-500 text-white rounded-full' />
                        <p className='text-sm transition-all duration-300 group-hover:text-indigo-600'>Create Resume</p>
                    </button>
                    <button onClick={() => setShowUploadResume(true)} className='flex flex-col items-center justify-center w-full h-48 gap-2 transition-all duration-300 bg-white border border-dashed rounded-lg cursor-pointer sm:max-w-36 text-slate-600 border-slate-300 group hover:border-purple-500 hover:shadow-lg'>
                        <UploadCloudIcon className='transition-all duration-300 w-11 h-11 p-2.5 bg-linear-to-r from-purple-500 to-purple-500 text-white rounded-full' />
                        <p className='text-sm transition-all duration-300 group-hover:text-purple-600'>Upload Existing</p>
                    </button>
                </div>
                <hr className='border-slate-300 my-6 sm:w-[305px]' />
                <div className='grid flex-wrap grid-cols-2 gap-4 sm:flex'>
                    {allResumes.map((resume, index) => {
                        const baseColor = colors[index % colors.length];
                        return (
                            <button onClick={() => navigate(`/app/builder/${resume._id}`)} key={index} className='relative flex flex-col items-center justify-center w-full h-48 gap-2 transition-all duration-300 border rounded-lg cursor-pointer sm:max-w-36 group hover:shadow-lg' style={{ background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`, borderColor: baseColor + '40' }}>
                                <FilePenLineIcon className='transition w-7 h-7 group-hover:scale-105' style={{ color: baseColor }} />
                                <p className='px-2 text-sm text-center transition-all group-hover:scale-105' style={{ color: baseColor }}>{resume.title}</p>
                                <p className='absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-transform duration-300 px-2 text-center' style={{ color: baseColor + '90' }}>Update on {new Date(resume.updatedAt).toLocaleDateString()}</p>
                                <div onClick={(e) => e.stopPropagation()} className='absolute items-center hidden top-1 right-1 group-hover:flex'>
                                    <TrashIcon onClick={() => deleteResume(resume._id)} className='w-7 h-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors' />
                                    <PencilIcon onClick={() => { setEditResumeId(resume._id); setTitle(resume.title) }} className='w-7 h-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors' />
                                </div>
                            </button>
                        )
                    })}
                </div>
                {
                    showCreateResume && (
                        <form onSubmit={createResume} onClick={() => setShowCreateResume(false)} className='fixed inset-0 z-10 flex items-center justify-center bg-opacity-50 bg-black/70 backdrop-blur'>
                            <div onClick={(e) => e.stopPropagation()} className='relative w-full max-w-sm p-6 border rounded-lg shadow-md bg-slate-50'>
                                <h2 className='mb-4 text-xl font-bold'>Create a Resume</h2>
                                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />
                                <button className='w-full py-2 text-white transition bg-green-600 rounded hover:bg-green-700'>Create Resume</button>
                                <XIcon onClick={() => { setShowCreateResume(false); setTitle(''); }} className='absolute transition-colors cursor-pointer top-4 right-4 text-slate-400 hover:text-slate-600' />
                            </div>
                        </form>
                    )
                }
                {
                    showUploadResume && (
                        <form onSubmit={uploadResume} onClick={() => setShowUploadResume(false)} className='fixed inset-0 z-10 flex items-center justify-center bg-opacity-50 bg-black/70 backdrop-blur'>
                            <div onClick={(e) => e.stopPropagation()} className='relative w-full max-w-sm p-6 border rounded-lg shadow-md bg-slate-50'>
                                <h2 className='mb-4 text-xl font-bold'>Upload a Resume</h2>
                                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Upload Existing resume' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />
                                <div>
                                    <label htmlFor="resume-input" className='block text-sm text-slate-700'>
                                        Select a resume file to upload.
                                        <div className='flex flex-col items-center justify-center gap-2 p-4 py-10 my-4 transition-colors border-dashed rounded-md cursor-pointer group text-slate-400 border-slate-400 hover:border-green-500 hover:text-green-700'>
                                            {resume ? (
                                                <p className='text-green-700'>{resume.name}</p>
                                            ) : (
                                                <>
                                                    <UploadCloud className='stroke-1 w-14 h-14' />
                                                    <p>Upload your resume</p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                    <input onChange={(e) => setResume(e.target.files[0])} type="file" id='resume-input' accept='.pdf' hidden />
                                </div>
                                <button disabled={isLoading} className='flex items-center justify-center w-full gap-2 py-2 text-white transition bg-green-600 rounded hover:bg-green-700'>
                                    {isLoading && <LoaderCircleIcon className='text-white animate-spin size-4' />}
                                    {isLoading ? 'Uploading...' : 'Upload Resume'}
                                </button>
                                <XIcon onClick={() => { setShowUploadResume(false); setTitle(''); }} className='absolute transition-colors cursor-pointer top-4 right-4 text-slate-400 hover:text-slate-600' />
                            </div>
                        </form>
                    )
                }
                {
                    editResumeId && (
                        <form onSubmit={editTitle} onClick={() => setEditResumeId(false)} className='fixed inset-0 z-10 flex items-center justify-center bg-opacity-50 bg-black/70 backdrop-blur'>
                            <div onClick={(e) => e.stopPropagation()} className='relative w-full max-w-sm p-6 border rounded-lg shadow-md bg-slate-50'>
                                <h2 className='mb-4 text-xl font-bold'>Edit Resume Title</h2>
                                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />
                                <button className='w-full py-2 text-white transition bg-green-600 rounded hover:bg-green-700'>update</button>
                                <XIcon onClick={() => { setEditResumeId(''); setTitle(''); }} className='absolute transition-colors cursor-pointer top-4 right-4 text-slate-400 hover:text-slate-600' />
                            </div>
                        </form>
                    )
                }
            </div>
        </div>
    )
}

export default Dashboard

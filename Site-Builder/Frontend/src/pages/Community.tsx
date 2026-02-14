import React, { useEffect, useState } from 'react'
import { Project } from '../types';
import { Loader2Icon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dummyProjects } from '../assets/assets';
import Footer from '../components/Footer';

function Community() {

    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Array<Project>>([]);

    const navigate = useNavigate();

    const fetchProjects = async () => {
        setProjects(dummyProjects)

        // Simulate Loading
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <>
            <div className='px-4 md:px-16 lg:px-24 xl:px-32'>
                {loading ? (
                    <div className='flex items-center justify-center h-[80vh]'>
                        <Loader2Icon className='text-indigo-200 size-7 animate-spin' />
                    </div>
                ) : projects.length > 0 ? (
                    <div className='py-10 min-h-[80vh]'>
                        <div className='flex items-center justify-between mb-12'>
                            <h1 className='text-3xl font-medium text-white'>Published Projects</h1>
                        </div>
                        <div className='flex flex-wrap gap-3.5'>
                            {projects.map((project) => (
                                <Link to={`/view/${project.id}`} key={project.id} target='_blank' className='transition-all duration-300 border border-gray-700 rounded-lg cursor-pointer w-72 max-sm:mx-auto bg-gray-900/60 overflow-hidden-md hover:border-indigo-800/80'>
                                    {/* Desktop-like mini preview */}
                                    <div className='relative w-full h-40 overflow-hidden bg-gray-900 border-b border-gray-800'>
                                        {project.current_code ? (
                                            <iframe srcDoc={project.current_code} className='absolute top-0 left-0 origin-top-left w-300 h-200 pointer-same-origin' style={{ transform: 'scale(0.25)' }} />
                                        ) : (
                                            <div className='flex items-center justify-center h-full text-gray-500'>
                                                <p>No Preview</p>
                                            </div>
                                        )}
                                    </div>
                                    {/* Content */}
                                    <div className='p-4 text-white transition-all bg-linear-180 from-transparent group-hover:from-indigo-950 to-transparent'>
                                        <div className='flex items-start justify-between'>
                                            <h2>{project.name}</h2>
                                            <button className='px-2 py-0.5 mt-1 lm-2 text-xs bg-gray-800 border border-gray-700 rounded-full'>Website</button>
                                        </div>
                                        <p className='mt-1 text-sm text-gray-400 line-clamp-2'>{project.initial_prompt}</p>
                                        <div className='flex items-center justify-between mt-6'>
                                            <span className='text-xs text-gray-500'>{new Date(project.createdAt).toLocaleDateString()}</span>
                                            <div className='flex gap-3 text-sm text-white'>
                                                <button className='px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md transition-colors flex items-center gap-2'>
                                                    <span className='bg-gray-200 size-4.5 rounded-full text-black font-semibold text-xs flex items-center justify-center'>
                                                        {project.user?.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                    {project.user?.name}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center h-[80vh]'>
                        <h1 className='text-2xl font-semibold text-gray-300'>You have no project yet!</h1>
                        <button onClick={() => navigate('/')} className='px-5 py-2 mt-5 text-white transition-all bg-indigo-500 rounded-md hover:bg-indigo-600 active:scale-95'>
                            Create New
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}

export default Community

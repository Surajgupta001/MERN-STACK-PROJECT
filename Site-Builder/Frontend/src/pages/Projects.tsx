import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Project } from '../types';
import { LaptopIcon, Loader2Icon, MessageSquareIcon, SaveIcon, SmartphoneIcon, TabletIcon, XIcon, FullscreenIcon, ArrowBigDownDashIcon, EyeOffIcon, EyeIcon } from 'lucide-react';
import { dummyConversations, dummyProjects, dummyVersion } from '../assets/assets';
import Sidebar from '../components/Sidebar';
import ProjectPreview from '../components/ProjectPreview';
import { projectPreviewRef } from '../components/ProjectPreview';

function Projects() {

    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    const [isGenerating, setIsGenerating] = useState(false);
    const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>('desktop');

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const previewRef = useRef<projectPreviewRef>(null);

    const fetchProject = async () => {
        const project = dummyProjects.find(project => project.id === projectId) || null;

        setTimeout(() => {
            if (project) {
                setProject({
                    ...project,
                    conversation: dummyConversations,
                    versions: dummyVersion
                });
                setIsGenerating(project.current_code ? false : true);
            }
            setLoading(false);
        }, 2000)
    };

    const saveProject = async () => {
        
    };

    const downlaodCode = async () => {

    };

    const togglePublish = async () => {

    };

    useEffect(() => {
        fetchProject();
    }, []);

    if (loading) {
        return (
            <>
                <div className='flex items-center justify-center h-screen'>
                    <Loader2Icon className='size-7 animate-spin text-violet-200' />
                </div>
            </>
        )
    };

    return project ? (
        <div className='flex flex-col w-full h-screen text-white bg-gray-900'>
            {/* Builder Navbar */}
            <div className='flex gap-4 px-4 py-2 overflow-x-auto max-sm:flex-col sm:items-center no-scrollbar'>
                {/* Left  */}
                <div className='flex items-center gap-2 sm:min-w-90 text-nowrap'>
                    <img onClick={() => navigate('/')} src="/favicon.svg" alt="logo" className='h-6 cursor-pointer' />
                    <div className='max-w-64 sm:max-w-xs'>
                        <p className='text-sm capitalize truncate text-medium'>{project.name}</p>
                        <p className='text-xs text-gray-400 -mt-0.5'>Previewing last saved version</p>
                    </div>
                    <div className='flex justify-end flex-1 sm:hidden'>
                        {
                            isMenuOpen ?
                                <MessageSquareIcon onClick={() => setIsMenuOpen(false)} className='cursor-pointer size-6' />
                                :
                                <XIcon onClick={() => setIsMenuOpen(true)} className='cursor-pointer size-6' />
                        }
                    </div>
                </div>
                {/* Middle  */}
                <div className='hidden gap-2 sm:flex bg-gray-950 p-1.5 rounded-md'>
                    <SmartphoneIcon onClick={() => setDevice('phone')} className={`size-6 p-1 rounded cursor-pointer ${device === 'phone' ? 'bg-gray-700' : ''}`} />
                    <TabletIcon onClick={() => setDevice('tablet')} className={`size-6 p-1 rounded cursor-pointer ${device === 'tablet' ? 'bg-gray-700' : ''}`} />
                    <LaptopIcon onClick={() => setDevice('desktop')} className={`size-6 p-1 rounded cursor-pointer ${device === 'desktop' ? 'bg-gray-700' : ''}`} />
                </div>
                {/* Right  */}
                <div className='flex items-center justify-end flex-1 gap-3 text-xs sm:text-sm'>
                    <button onClick={saveProject} disabled={isSaving} className='bg-gray-800 max-sm:hidden hover:bg-gray-700 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors border border-gray-700'>
                        {isSaving ? <Loader2Icon className='size-4 animate-spin' /> : <SaveIcon size={16} />}
                        Save
                    </button>
                    <Link target='_blank' to={`/preview/${projectId}`} className='flex items-center gap-2 px-4 py-1 transition-colors border border-gray-700 rounded sm:rounded-sm hover:border-gray-500' >
                        <FullscreenIcon size={16} />Preview
                    </Link>
                    <button onClick={downlaodCode} className='bg-linear-to-br from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors'>
                        <ArrowBigDownDashIcon size={16} />
                        Download
                    </button>
                    <button onClick={togglePublish} className='bg-linear-to-br from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors'>
                        {
                            project.isPublished ?
                                <EyeOffIcon size={16} />
                                : <EyeIcon size={16} />
                        }
                        {project.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                </div>
            </div>
            <div className='flex flex-1 overflow-auto no-scrollbar'>
                <Sidebar isMenuOpen={isMenuOpen} project={project} setProject={(p) => setProject(p)} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />
                <div className='flex-1 p-2 pl-0'>
                    <ProjectPreview ref={previewRef} project={project} isGenerating={isGenerating} device={device} showEditorPanel={!isMenuOpen} />
                </div>
            </div>
        </div>
    ) : (
        <div className='flex items-center justify-center h-screen'>
            <p className='text-2xl font-medium text-gray-200'>Unable to load project!</p>
        </div>
    )
}

export default Projects

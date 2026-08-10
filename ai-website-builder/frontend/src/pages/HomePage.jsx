import { useEffect } from 'react';
import { homeTags } from '../assets/assets';
import PromptInput from '../components/PromptInput';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, ClockIcon, Trash2Icon } from 'lucide-react';
import moment from 'moment';

function HomePage() {

    const { user, projects, loadingProjects, generatingProject, loadProjects, handleGenerate, handleDelete, logout } = useAppContext();

    const navigate = useNavigate();

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    return (
        <div className="h-screen overflow-y-scroll font-sans text-white bg-[url('/bg-img.png')] bg-cover bg-center bg-no-repeat">

            {/* Nav */}
            <nav className='sticky top-0 z-10 flex items-center justify-between px-6 py-4'>
                <div className="flex items-center gap-2">
                    <img src="/logo.svg" alt="Logo" className='size-6' />
                    <span className='text-xl font-semibold tracking-tight'>builderAI</span>
                </div>
                <div className='flex items-center gap-4 text-sm font-medium text-zinc-300'>
                    <span>{user?.name}</span>
                    <button onClick={logout} className='py-1.5 px-3 border border-white/20 text-white hover:bg-white/10 text-xs rounded-md cursor-pointer bg-transparent'>Sign Out</button>
                </div>
            </nav>

            {/* Hero */}
            <div className='flex flex-col items-center justify-start flex-1 px-6 pt-12 pb-16 xl:pt-16'>

                {/* Promo Badge */}
                <div className='flex items-center gap-2 p-1.5 pr-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[13px] text-white/90'>
                    <span className='px-3 py-1 text-[11px] bg-red-700 rounded-full font-medium tracking-wider'>PROMO</span>
                    <span>Create your first project for free</span>
                </div>

                {/* Title */}
                <h1 className='max-w-2xl mt-4 text-4xl font-medium text-center text-white ml:text-6xl'>Build your presence on the web</h1>

                {/* Subtitle */}
                <p className='max-w-xl mt-4 text-sm leading-relaxed text-center md:text-base text-white/65'>Describe what you need, preview instantly, and customize your site in real-time. React with clean JSX, verified layouts, and instant code exports.</p>

                {/* Prompt input with glassmorphic variant */}
                <div className='w-full mt-6'>
                    <PromptInput
                        onSubmit={handleGenerate}
                        loading={generatingProject}
                        placeholder='Create a portfolio website...'
                        variant='glass'
                        autoFocus
                    />
                </div>

                {/* Scrolling marque Tags */}
                <div className='w-full max-w-2xl py-1 mt-4 overflow-hidden masked-marquee'>
                    <div className='gap-3 animate-marquee'>
                        {homeTags.map((tag, i) => (
                            <button
                                key={i}
                                onClick={() => handleGenerate(tag)}
                                disabled={generatingProject}
                                className='px-4 py-1.5 border rounded-full text-sm text-white/q0 border-white/25 hover:bg-white/20 transition cursor-pointer shrink-0 font-medium'
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* All projects */}
                {!loadingProjects && projects.length > 0 && (
                    <div className='w-full max-w-2xl mt-8'>
                        <div className='flex items-center justify-between pb-3 mb-3 border-b border-white/10'>
                            <p className='text-xs font-medium tracking-widest uppercase text-zinc-100'>All Projects</p>
                            <span className='text-sm font-medium text-zinc-200'>
                                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                            </span>
                        </div>
                        <div className='space-y-2 max-h-[80vh] overflow-y-auto pr-1'>
                            {projects.map((p) => (
                                <div
                                    key={p._id}
                                    className='flex items-center justify-between px-4 py-3 transition-all border rounded-lg cursor-pointer bg-white/5 border-white/10 group hover:border-white/20 hover:bg-white/10 backdrop-blur-md '
                                    onClick={() => navigate(`/builder/${p._id}`)}
                                >
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-sm font-medium text-white truncate'>{p.name}</p>
                                        <div className='flex items-center gap-3 mt-0.5'>
                                            <span className='flex items-center gap-1 text-xs text-zinc-300'>
                                                <ClockIcon size={10} />
                                                {moment(p.updatedAt || p.createdAt).fromNow()}
                                            </span>
                                            <span className='text-xs font-medium text-white/60'>v{p.version}</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(p._id);
                                            }}
                                            className='p-1.5 rounded-md text-zinc-200 hover:text-red-400 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity'
                                        >
                                            <Trash2Icon size={14} />
                                        </button>
                                        <ArrowRightIcon size={14} className='text-zinc-200 group-hover:text-white' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage
import React, { useRef, useEffect, useState } from 'react'
import { Project, Message, Version } from '../types';
import { BotIcon, UserIcon, EyeIcon, Loader2Icon, SendIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
    isMenuOpen: boolean;
    project: Project;
    setProject: (project: Project) => void;
    isGenerating: boolean;
    setIsGenerating: (isGenerating: boolean) => void;
};

function Sidebar({ isMenuOpen, project, setProject, isGenerating, setIsGenerating }: SidebarProps) {

    const messageRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState('');

    const handleRollBack = async (versionId: string) => {

    };

    const handleRevisions = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
        }, 3000);
    };

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [project.conversation.length, isGenerating]);

    return (
        <div className={`h-full transition-all bg-gray-900 border-gray-800 sm:max-w-sm rounded-xl ${isMenuOpen ? 'max-sm:w-0 overflow-hidden' : 'w-full'}`}>
            <div className='flex flex-col h-full'>
                {/* Messages Container */}
                <div className='flex flex-col flex-1 gap-4 px-3 overflow-y-auto no-scrollbar'>
                    {[...project.conversation, ...project.versions]
                        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((message) => {
                            const isMessage = 'content' in message;

                            if (isMessage) {
                                const msg = message as Message;
                                const isUser = msg.role === 'user';
                                return (
                                    <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                                        {!isUser && (
                                            <div className='flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-indigo-600 to-indigo-700'>
                                                <BotIcon className='text-white size-5' />
                                            </div>
                                        )}
                                        <div className={`max-w-[80%] p-2 px-4 rounded-2xl shadow-sm text-sm mt-5 leading-relaxed ${isUser ? 'bg-linear-to-br from-indigo-500 to-indigo-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-300 rounded-tl-none'}`}>
                                            {msg.content}
                                        </div>
                                        {isUser && (
                                            <div className='flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full'>
                                                <UserIcon className='text-gray-200 size-5' />
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                            else {
                                const ver = message as Version;
                                return (
                                    <div key={ver.id} className='flex flex-col w-4/5 gap-2 p-3 mx-auto my-2 text-gray-100 bg-gray-800 shadow rounded-xl'>
                                        <div className='text-xs font-medium'>
                                            code updated <br /> <span className='text-xs font-normal text-gray-500'>
                                                {new Date(ver.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            {project.current_version_index === ver.id ? (
                                                <button className='px-3 py-1 text-xs bg-gray-700 rounded-md'>
                                                    Current Version
                                                </button>
                                            ) : (
                                                <button onClick={() => handleRollBack(ver.id)} className='px-3 py-1 text-xs text-white bg-indigo-500 rounded-md hover:bg-indigo-600'>Roll back to version</button>
                                            )}
                                            <Link target='_blank' to={`preview/${project.id}/${ver.id}`}>
                                                <EyeIcon className='p-1 transition bg-gray-700 rounded size-6 hover:bg-transition-colors' />
                                            </Link>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    {isGenerating && (
                        <div className='flex items-start justify-start gap-3'>
                            <div className='flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-indigo-600 to-indigo-700'>
                                <BotIcon className='text-white size-5' />
                            </div>
                            {/* Three dot loader */}
                            <div className='flex gap-1.5 h-8 items-center'>
                                <span className='w-2 h-2 bg-indigo-400 rounded-full animate-bounce' style={{ animationDelay: '0s' }}></span>
                                <span className='w-2 h-2 bg-indigo-400 rounded-full animate-bounce' style={{ animationDelay: '0.2s' }}></span>
                                <span className='w-2 h-2 bg-indigo-400 rounded-full animate-bounce' style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messageRef} />
                </div>
                {/* Input area */}
                <form onSubmit={handleRevisions} className='relative m-3'>
                    <div className='flex items-center gap-2'>
                        <textarea onChange={(e) => setInput(e.target.value)} value={input} rows={4} placeholder='Describe your website or request changes...' className='flex-1 p-3 text-sm text-gray-100 placeholder-gray-400 transition-all bg-gray-800 outline-none resize-none rounded-xl ring ring-gray-700 focus:ring-indigo-500' disabled={isGenerating} />
                        <button disabled={isGenerating || !input.trim()} className='absolute bottom-2.5 right-2.5 rounded-full bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white transition-colors disabled:opacity-60'>
                            {isGenerating
                                ? <Loader2Icon className='size-7 p-1.5 animate-spin text-white' />
                                : <SendIcon onClick={handleRevisions} className='size-7 p-1.5 text-white' />
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Sidebar

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
    }, [project.conversation.length]);

    return (
        <div>
            
        </div>
    )
}

export default Sidebar

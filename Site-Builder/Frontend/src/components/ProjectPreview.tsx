import React, { forwardRef, useRef, ForwardedRef, useImperativeHandle } from 'react'
import { Project } from '../types';
import { iframeScript } from '../assets/assets';

interface ProjectPreviewProps {
    project: Project;
    isGenerating: boolean;
    device?: 'phone' | 'tablet' | 'desktop';
    showEditorPanel: boolean;
};

export interface projectPreviewRef {
    getCode: () => string | undefined;
};

function ProjectPreview({ project, isGenerating, device = 'desktop', showEditorPanel = true }: ProjectPreviewProps, ref: ForwardedRef<projectPreviewRef>) {

    const iframeRef = useRef<HTMLIFrameElement>(null);

    useImperativeHandle(ref, () => ({
        getCode: () => {
            return project.current_code;
        }
    }));

    const resolutions = {
        phone: 'max-w-[412px]',
        tablet: 'max-w-[768px]',
        desktop: 'max-w-full'
    };
    
    const injectPreview = (html : string) => {
        if (!html) return '';
        if (!showEditorPanel) return html;

        if (html.includes('</body>')) {
            return html.replace('</body>', iframeScript + '</body>');
        } else {
            return html + iframeScript;
        }
    };
    
    return (
        <div className='relative flex flex-col items-center justify-center flex-1 h-full p-4 overflow-hidden bg-gray-900 rounded-xl max-sm:ml-2'>
            {project.current_code ? (
                <div className={`w-full h-full ${resolutions[device]} transition-all duration-300 shadow-2xl bg-white overflow-hidden`}>
                    <iframe
                        ref={iframeRef}
                        srcDoc={injectPreview(project.current_code)}
                        className="w-full h-full border-none"
                    />
                </div>
            ) : isGenerating && (
                <div className='flex items-center justify-center h-full'>
                    <div className='text-gray-400 animate-pulse'>Generating your project...</div>
                </div>
            )}
        </div>
    );
}

export default forwardRef(ProjectPreview)

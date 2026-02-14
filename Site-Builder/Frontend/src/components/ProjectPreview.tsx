import React, { forwardRef, useRef, ForwardedRef, useImperativeHandle, useState, useEffect } from 'react'
import { Project } from '../types';
import { iframeScript } from '../assets/assets';
import EditorPanel from './EditorPanel';

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
    const [selectedElement, setSelectedElement] = useState<any>(null);

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

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'ELEMENT_SELECTED') {
                setSelectedElement(event.data.payload);
            }
            else if (event.data.type === 'CLEAR_SELECTION') {
                setSelectedElement(null);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const handleUpdate = (updates: any) => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'UPDATE_ELEMENT',
                payload: updates
            },
                '*'
            );
        }
    };

    const injectPreview = (html: string) => {
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
                    {showEditorPanel && selectedElement && (
                        <EditorPanel selectedElement={selectedElement}
                            onUpdate={handleUpdate} onClose={() => {
                                setSelectedElement(null);
                                if (iframeRef.current?.contentWindow) {
                                    iframeRef.current.contentWindow.postMessage({ type: 'CLEAR_SELECTION_REQUEST' }, '*');
                                }
                            }}
                        />
                    )}
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

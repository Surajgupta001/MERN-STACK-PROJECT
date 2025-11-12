import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from 'lucide-react';
import PersonalInfoForm from '../components/PersonalInfoForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import ColorPicker from '../components/ColorPicker';
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm';
import ExperienceForm from '../components/ExperienceForm';
import EducationForm from '../components/EducationForm';
import ProjectForm from '../components/ProjectForm';
import SkillsForm from '../components/SkillsForm';
import { useSelector } from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';

function ResumeBuilder() {

    const { token } = useSelector(state => state.auth);
    const { resumeId } = useParams();

    const [resumeData, setResumeData] = useState({
        id: "",
        title: "",
        personal_info: {},
        professional_summary: "",
        experience: [],
        education: [],
        project: [],
        skills: [],
        template: "classic",
        // store accent color normalized to lowercase to avoid equality issues (#3b82f6 vs #3B82F6)
        accent_color: "#3b82f6",
        public: false,
    });


    const loadExistingResume = useCallback(async () => {
        try {
            const { data } = await api.get(`/api/v1/resumes/get/${resumeId}`, {
                headers: { Authorization: token }
            })
            if (data.resume) {
                setResumeData(data.resume);
                document.title = data.resume.title || 'Resume Builder';
            }
        } catch (error) {
            console.log(error.message);
        }
    }, [resumeId, token]);

    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [removeBackground, setRemoveBackground] = useState(false);

    const sections = [
        {
            id: "personal",
            name: "Personal Info",
            icon: User
        },
        {
            id: "summary",
            name: "Summary",
            icon: FileText
        },
        {
            id: "experience",
            name: "Experience",
            icon: Briefcase
        },
        {
            id: "education",
            name: "Education",
            icon: GraduationCap
        },
        {
            id: "projects",
            name: "Projects",
            icon: FolderIcon
        },
        {
            id: "skills",
            name: "Skills",
            icon: Sparkles
        }
    ]

    const activeSection = sections[activeSectionIndex];

    const changeResumeVisibility = async () => {
        try {
            const formData = new FormData();
            formData.append('resumeId', resumeId);
            formData.append('resumeData', JSON.stringify({ public: !resumeData.public }));

            const { data } = await api.put(`/api/v1/resumes/update`, formData, {
                headers: { Authorization: token }
            })
            setResumeData({ ...resumeData, public: !resumeData.public })
            toast.success(data.message);
        } catch (error) {
            console.error('Error Saving resume', error);
        }
    };

    const handleShare = () => {
        const frontendURL = window.location.href.split('/app/')[0];
        const resumeUrl = `${frontendURL}/view/${resumeId}`;

        if (navigator.share) {
            navigator.share({
                url: resumeUrl,
                text: 'My Resume'
            });
        } else {
            alert('Share not supported on this browser.')
        }
    };

    const downloadResume = () => {
        window.print();
    };

    const saveResume = async () => {
        let updatedResumeData = structuredClone(resumeData);

        // remove image from updatedResumeData
        if (typeof updatedResumeData.personal_info.image === 'object') {
            delete updatedResumeData.personal_info.image;
        }

        const formData = new FormData();
        formData.append('resumeId', resumeId);
        formData.append('resumeData', JSON.stringify(updatedResumeData));
    if (removeBackground) formData.append('removeBackground', 'true');
        if (typeof resumeData.personal_info.image === 'object') formData.append('image', resumeData.personal_info.image);

        const { data } = await api.put(`/api/v1/resumes/update`, formData, {
            headers: { Authorization: token }
        });
        setResumeData(data.resume);
        // If background removal was requested, reset the toggle after successful save
        if (removeBackground) setRemoveBackground(false);
        // Return message so toast.promise can show it as success text
        return data.message;
    };

    useEffect(() => {
        loadExistingResume();
    }, [loadExistingResume]);

    const [isSaving, setIsSaving] = useState(false);

    // Keep the browser tab title in sync with the resume title or user name
    useEffect(() => {
        const titlePart = (resumeData?.title || '').trim();
        const firstName = (resumeData?.personal_info?.first_name || '').trim();
        const lastName = (resumeData?.personal_info?.last_name || '').trim();
        const namePart = [firstName, lastName].filter(Boolean).join(' ');

        const finalTitle = titlePart || (namePart ? `${namePart} resume` : 'Resume');
        if (finalTitle) document.title = finalTitle;
    }, [resumeData.title, resumeData?.personal_info?.first_name, resumeData?.personal_info?.last_name]);

    return (
        <div>
            <div className='px-4 py-6 mx-auto max-w-7xl'>
                <Link to={'/app'} className='inline-flex items-center gap-2 transition-all text-slate-500 hover:text-slate-700'>
                    <ArrowLeftIcon className='w-4 h-4' />
                    Back to Dashboard
                </Link>
            </div>
            <div className='px-4 pb-8 mx-auto max-w-7xl'>
                <div className='grid gap-8 lg:grid-cols-12'>
                    {/* Left Panel - Form */}
                    <div className='relative overflow-hidden rounded-lg lg:col-span-5'>
                        <div className='p-6 pt-1 bg-white border border-gray-200 rounded-lg shadow-sm'>
                            {/* Progress bar using activeSectionIndex */}
                            <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' />
                            <hr className='absolute top-0 left-0 h-1 transition-all duration-300 border-none bg-linear-to-r from-green-500 to-green-600' style={{ width: `${(activeSectionIndex * 100) / (sections.length - 1)}%` }} />
                            {/* Section Navigation */}
                            <div className='flex items-center justify-between py-1 mb-6 border-b border-gray-300'>
                                <div className='flex items-center gap-2'>
                                    <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData(prev => ({ ...prev, template }))} />
                                    <ColorPicker
                                        selectedColor={resumeData.accent_color}
                                        onChange={(color) => setResumeData(prev => ({ ...prev, accent_color: color.toLowerCase() }))}
                                    />
                                </div>
                                <div className='flex items-center'>
                                    {
                                        activeSectionIndex != 0 && (
                                            <button onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} className='flex items-center gap-1 p-3 text-sm font-medium text-gray-600 transition-all rounded-lg hover:bg-gray-50' disabled={activeSectionIndex === 0}>
                                                <ChevronLeft className='w-4 h-4' />
                                                Previous
                                            </button>
                                        )
                                    }
                                    <button onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-50'}`} disabled={activeSectionIndex === sections.length - 1}>
                                        <ChevronRight className='w-4 h-4' />
                                        Next
                                    </button>
                                </div>
                            </div>
                            {/* Form Content */}
                            <div className='space-y-6'>
                                {activeSection.id === "personal" && (
                                    <PersonalInfoForm data={resumeData.personal_info} onChange={(data) => setResumeData(prev => ({ ...prev, personal_info: data }))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                                )}
                                {activeSection.id === "summary" && (
                                    <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data) => setResumeData(prev => ({ ...prev, professional_summary: data }))} setResumeData={setResumeData} />
                                )}
                                {activeSection.id === "experience" && (
                                    <ExperienceForm data={resumeData.experience} onChange={(data) => setResumeData(prev => ({ ...prev, experience: data }))} />
                                )}
                                {activeSection.id === "education" && (
                                    <EducationForm data={resumeData.education} onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))} />
                                )}
                                {activeSection.id === "projects" && (
                                    <ProjectForm data={resumeData.project} onChange={(data) => setResumeData(prev => ({ ...prev, project: data }))} />
                                )}
                                {activeSection.id === "skills" && (
                                    <SkillsForm data={resumeData.skills} onChange={(data) => setResumeData(prev => ({ ...prev, skills: data }))} />
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    if (isSaving) return;
                                    setIsSaving(true);
                                    toast.promise(
                                        saveResume(),
                                        {
                                            loading: 'Saving...',
                                            success: (msg) => msg || 'Resume updated successfully',
                                            error: (err) => err?.response?.data?.message || err?.message || 'Failed to save'
                                        }
                                    ).finally(() => setIsSaving(false));
                                }}
                                disabled={isSaving}
                                className={`px-6 py-2 mt-6 text-sm text-green-600 transition-all rounded-md bg-linear-to-br from-green-100 to-green-200 ring-green-300 ring hover:ring-green-400 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                    {/* Right Panel - Preview */}
                    <div className='lg:col-span-7 max-lg:mt-6'>
                        <div className='relative w-full'>
                            <div className='absolute left-0 right-0 flex items-center justify-end gap-2 bottom-3'>
                                {resumeData.public && (
                                    <button onClick={handleShare} className='flex items-center gap-2 p-2 px-4 text-xs text-blue-600 transition-colors rounded-lg bg-linear-to-br from-blue-100 to-blue-200 ring-blue-300 hover:ring'>
                                        <Share2Icon className='w-4 h-4' /> Share
                                    </button>
                                )}
                                <button onClick={changeResumeVisibility} className='flex items-center gap-2 p-2 px-4 text-xs text-purple-600 transition-colors rounded-lg bg-linear-to-br from-purple-100 to-purple-200 ring-purple-300 hover:ring'>
                                    {resumeData.public ? <EyeIcon className='w-4 h-4' /> : <EyeOffIcon className='w-4 h-4' />}
                                    {resumeData.public ? 'Public' : 'Private'}
                                </button>
                                <button onClick={downloadResume} className='flex items-center gap-2 px-6 py-2 text-xs text-green-600 transition-colors rounded-lg bg-linear-to-br from-green-100 to-green-200 ring-green-300 hover:ring'>
                                    <DownloadIcon className='w-4 h-4' /> Download
                                </button>
                            </div>
                        </div>
                        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResumeBuilder

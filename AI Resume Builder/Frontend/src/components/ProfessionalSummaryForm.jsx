import { Loader2, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api';
import toast from 'react-hot-toast';

function ProfessionalSummaryForm({ data, onChange, setResumeData }) {

    const { token } = useSelector(state => state.auth);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateSummary = async () => {
        try {
            setIsGenerating(true);
            const prompt = `enhance my professional summary '${data}'`;
            const response = await api.post('/api/v1/ai/enhance-pro-sum', {
                userContent: prompt
            }, {
                headers: { Authorization: token }
            })
            // Backend returns { success, data: <enhanced text> }
            const enhanced = response.data?.data;
            if (!enhanced) {
                throw new Error('AI response missing enhanced content');
            }
            setResumeData(prev => ({ ...prev, professional_summary: enhanced }));
            toast.success('Summary enhanced');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsGenerating(false);
        }
    };
    
    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
                    <p className='text-sm text-gray-600'>Add Summary for your resume here</p>
                </div>
                <button disabled={isGenerating} onClick={generateSummary} className='flex items-center gap-2 px-3 py-1 text-sm text-purple-700 transition-colors bg-purple-100 rounded hover:bg-purple-200 disabled:opacity-50'>
                    {isGenerating ? (<Loader2 className='w-4 h-4 animate-spin' />) : <Sparkles className='w-4 h-4' />}
                    {isGenerating ? 'Enhancing...' : 'AI Enhance'}
                </button>
            </div>
            <div className='mt-6'>
                <textarea onChange={(e) => onChange(e.target.value)} value={data || ''} className='w-full p-3 px-4 mt-2 text-sm transition-colors border border-gray-300 rounded-lg outline-none resize-none focus:ring focus:ring-blue-500 focus:border-blue-500' rows={7} placeholder='Write a compelling summary that highlight your key strengths and career objectives....' />
                <p className='mx-auto text-xs text-center text-gray-500 max-w-4/5'>Tip: Keep it concise(3-4 sentence) and focus on your most relevant achievements and skills.</p>
            </div>
        </div>
    )
}

export default ProfessionalSummaryForm

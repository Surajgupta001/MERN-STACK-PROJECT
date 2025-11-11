import React from 'react'
import { Plus, Trash2, Folder } from 'lucide-react'

function ProjectForm({ data, onChange }) {

    const addProject = () => {
        const newProject = {
            name: '',
            type: '',
            description: ''
        };
        onChange([...data, newProject]);
    };

    const removeProject = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated);
    };

    const updateProject = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Projects</h3>
                    <p className='text-sm text-gray-600'>Add your projects</p>
                </div>
                <button onClick={addProject} className='flex items-center gap-2 px-3 py-1 text-sm text-green-700 transition-colors bg-green-100 rounded-lg hover:bg-green-200'>
                    <Plus className='w-4 h-4' />
                    Add Project
                </button>
            </div>
            <div className='mt-6 space-y-4'>
                {data.map((project, index) => (
                    <div key={index} className='p-4 space-y-3 border border-gray-200 rounded-lg'>
                        <div className='flex items-start justify-between'>
                            <h4>Project #{index + 1}</h4>
                            <button onClick={() => removeProject(index)} className='text-red-500 transition-colors hover:text-red-700'>
                                <Trash2 className='w-5 h-5' />
                            </button>
                        </div>
                        <div className='grid gap-3'>
                            <input onChange={(e) => updateProject(index, 'name', e.target.value)} value={project.name || ''} type="text" placeholder='Project Name' className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100' />
                            <input onChange={(e) => updateProject(index, 'type', e.target.value)} value={project.type || ''} type="text" placeholder='Project Type (e.g. Web App, CLI)' className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100' />
                            <textarea onChange={(e) => updateProject(index, 'description', e.target.value)} value={project.description || ''} className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100' placeholder='Project description (features, tech stack, your role)' rows={4} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProjectForm

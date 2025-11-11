import ai from '../config/ai.js';
import Resume from '../models/Resume.js';

// Controller for enhancing a resume's professional summary
// POST: /api/v1/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({
                success: false,
                message: 'User content is required',
            });
        }

        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_AI_MODEL,
            messages: [
                {
                    role: 'system',
                    content:
                        'You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Return only the enhanced text with no extra options or metadata.',
                },
                {
                    role: 'user',
                    content: userContent,
                },
            ],
        });

        const enhancedContent = response.choices[0].message.content;

        return res.status(200).json({
            success: true,
            data: enhancedContent,
        });

    } catch (error) {
        console.error('Error enhancing professional summary:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Controller for enhancing job descriptions
// POST: /api/v1/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({
                success: false,
                message: 'User content is required',
            });
        }

        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_AI_MODEL,
            messages: [
                {
                    role: 'system',
                    content:'You are an expert in resume writing. Your task is to enhance job descriptions. The descriptions should be concise, action-oriented, and highlight achievements using quantifiable metrics where possible. Make them compelling and ATS-friendly. Return only the enhanced text.',
                },
                {
                    role: 'user',
                    content: userContent,
                },
            ],
        });

        const enhancedContent = response.choices[0].message.content;

        return res.status(200).json({
            success: true,
            data: enhancedContent,
        });
        
    } catch (error) {
        console.error('Error enhancing job descriptions:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Controller for uploading a resume to the database
// POST: /api/v1/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText) {
            return res.status(400).json({
                success: false,
                message: 'Resume text is required',
            });
        }

        const systemPrompt = 'You are an expert AI Agent to extract data from resume.';

        const userPrompt = `extract data from this resume: ${resumeText}

        Provide data in the following JSON format with no additional text before or after:
        
        {
            "professional_summary": "",
            "skills": [],
            "personal_info": {
                "image": "",
                "full_name": "",
                "profession": "",
                "email": "",
                "phone": "",
                "location": "",
                "linkedin": "",
                "website": ""
            },
            "experience": [
                {
                    "company": "",
                    "position": "",
                    "start_date": "",
                    "end_date": "",
                    "description": "",
                    "is_current": false
                }
            ],
            "project": [
                {
                    "name": "",
                    "type": "",
                    "description": ""
                }
            ],
            "education": [
                {
                    "institution": "",
                    "degree": "",
                    "field": "",
                    "graduation_date": "",
                    "gpa": ""
                }
            ]
        }`;

        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_AI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: userPrompt,
                },
            ],
            response_format: {
                type: 'json_object',
            },
        });

        const extractedData = response.choices[0].message.content;
        const parsedData = JSON.parse(extractedData);
        const newResume = await Resume.create({
            userId,
            title,
            ...parsedData,
        });

        return res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully',
            resumeId: newResume._id,
        });
        
    } catch (error) {
        console.error('Error uploading resume:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
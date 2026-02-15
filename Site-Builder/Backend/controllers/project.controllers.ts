import type { Request, Response } from 'express';
import prisma from '../lib/prisma';
import openai from '../configs/openai';

// Controllers function to make Revision
export const makeRevision = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const { projectId } = req.params as { projectId: string };
        const { message } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user || !user) {
            return res
                .status(404)
                .json({
                    message: "Unauthorized user"
                });
        }

        if (user.credits < 5) {
            return res
                .status(403)
                .json({
                    message: "Add more credits to make a changes to your project"
                });
        }

        if (!message || message.trim() === "") {
            return res
                .status(400)
                .json({
                    message: "Please enter a valid prompt to make changes to your project"
                });
        }

        const currentproject = await prisma.websiteProject.findUnique({
            where: {
                id: projectId,
                userId
            }
        });

        if (!currentproject) {
            return res
                .status(404)
                .json({
                    message: "Project not found"
                });
        }

        await prisma.conversation.create({
            data: {
                role: 'user',
                content: message,
                projectId,
            }
        });

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                credits: {
                    decrement: 5
                }
            }
        });

        // Enhance user response
        const promptEnhanceResponse = await openai.chat.completions.create({
            model: "z-ai/glm-4.5-air:free",
            messages: [{
                role: "system",
                content: `You are a prompt enhancement specialist. The user wants to make changes to their website. Enhance their request to be more specific and actionable for a web developer.

                Enhance this by:
                1. Being specific about what elements to change
                2. Mentioning design details (colors, spacing, sizes)
                3. Clarifying the desired outcome
                4. Using clear technical terms
            
            Return ONLY the enhanced request, nothing else. Keep it concise (1-2 sentences).`
            }, {
                role: "user",
                content: `user's request: "${message}"`
            }]
        });

        const enhancedPrompt = promptEnhanceResponse.choices?.[0]?.message?.content || '';

        await prisma.conversation.create({
            data: {
                role: 'assistant',
                content: `I've enhanced your prompt to: "${enhancedPrompt}"`,
                projectId,
            }
        });

        await prisma.conversation.create({
            data: {
                role: 'assistant',
                content: 'Now making changes to your website...',
                projectId,
            }
        });

        // Generate website code
        const codeGenerationResponse = await openai.chat.completions.create({
            model: "z-ai/glm-4.5-air:free",
            messages: [{
                role: "system",
                content: `You are an expert web developer. 

                CRITICAL REQUIREMENTS:
                - Return ONLY the complete updated HTML code with the requested changes.
                - Use Tailwind CSS for ALL styling (NO custom CSS).
                - Use Tailwind utility classes for all styling changes.
                - Include all JavaScript in <script> tags before closing </body>
                - Make sure it's a complete, standalone HTML document with Tailwind CSS
                - Return the HTML Code Only, nothing else
            
                Apply the requested changes while maintaining the Tailwind CSS styling approach.`
            }, {
                role: "user",
                content: `Here is the current website code: "${currentproject.current_code}" The user want this change: "${enhancedPrompt}"`
            }]
        });

        const code = codeGenerationResponse.choices[0]?.message?.content || '';

        const version = await prisma.version.create({
            data: {
                code: code.replace(/```[a-z]*\n/g, '').replace(/```/g, '').trim(),
                description: 'changes made to the project',
                projectId,
            }
        });

        await prisma.conversation.create({
            data: {
                role: 'assistant',
                content: `I've made the changes to your website. Here is the updated code: "${version.code}"`,
                projectId,
            }
        });

        await prisma.websiteProject.update({
            where: {
                id: projectId,
            },
            data: {
                current_code: code.replace(/```[a-z]*\n/g, '').replace(/```/g, '').trim(),
                current_version_index: version.id,
            }
        });

        return res
            .status(200)
            .json({
                success: true,
                message: "Changes made successfully",
            });

    } catch (error: any) {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                credits: {
                    increment: 5
                }
            }
        });

        console.log(error.code || error.message);
        return res
            .status(500)
            .json({
                success: false,
                message: error.message,
            });
    }
};
// Controller function to rollback to a specific version
export const rollbackToVersion = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res
                .status(401)
                .json({
                    message: "Unauthorized user"
                });
        }

        const { projectId, versionId } = req.params as { projectId: string, versionId: string };

        const project = await prisma.websiteProject.findUnique({
            where: {
                id: projectId,
                userId
            },
            include: {
                versions: true,
            }
        });

        if (!project) {
            return res
                .status(404)
                .json({
                    message: "Project not found"
                });
        }

        const version = project.versions.find((version) => version.id === versionId);

        if (!version) {
            return res
                .status(404)
                .json({
                    message: "Version not found"
                });
        }

        await prisma.websiteProject.update({
            where: {
                id: projectId,
                userId
            },
            data: {
                current_code: version.code,
                current_version_index: version.id,
            }
        });

        await prisma.conversation.create({
            data: {
                role: 'assistant',
                content: "I've rolled back your website to the selected version. You can now preview it.",
                projectId,
            }
        });

        return res
            .status(200)
            .json({
                success: true,
                message: "Rolled back to version successfully",
            });

    } catch (error: any) {
        console.log(error.code || error.message);
        return res
            .status(500)
            .json({
                success: false,
                message: error.message,
            });
    }
};

// Controller function to delete a project
export const deleteProject = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { projectId } = req.params as { projectId: string };

        await prisma.websiteProject.delete({
            where: {
                id: projectId,
                userId
            }
        });

        return res
            .status(200)
            .json({
                success: true,
                message: "Project deleted successfully",
            });

    } catch (error: any) {
        console.log(error.code || error.message);
        return res
            .status(500)
            .json({
                success: false,
                message: error.message,
            });
    }
};

// Controllers for getting project code for preview
export const getProjectPreview = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { projectId } = req.params as { projectId: string };

        if (!userId) {
            return res
                .status(401)
                .json({
                    message: "Unauthorized user"
                });
        }

        const project = await prisma.websiteProject.findFirst({
            where: {
                id: projectId,
                userId,
            },
            include: {
                versions: true
            }
        });

        if (!project) {
            return res
                .status(404)
                .json({
                    message: "Project not found"
                });
        }

        return res
            .status(200)
            .json({
                success: true,
                messages: "Project preview retrieved successfully",
                project
            });

    } catch (error: any) {
        console.log(error.code || error.message);
        return res
            .status(500)
            .json({
                success: false,
                message: error.message,
            });
    }
};

// Get Publish Project
export const getPublishedProjects = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.websiteProject.findMany({
            where: {
                isPublished: true,
            },
            include: {
                user: true,
            }
        });

        return res
            .status(200)
            .json({
                success: true,
                messages: "Published projects retrieved successfully",
                projects
            });

    } catch (error: any) {
        console.log(error.code || error.message);
        return res
            .status(500)
            .json({
                success: false,
                message: error.message,
            });
    }
};

// Get a single project by id
export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params as { projectId: string };

        const project = await prisma.websiteProject.findFirst({
            where: {
                id: projectId
            }
        });

        if (!project || project.isPublished === false || !project?.current_code) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Project not found"
                });
        }

        return res
            .status(200)
            .json({
                success: true,
                messages: "Project retrieved successfully",
                code: project.current_code,
            });

    } catch (error: any) {
        console.log(error.code || error.message);
        return res
            .status(500)
            .json({
                success: false,
                message: error.message,
            });
    }
};

// Controllers to save project code
export const saveProjectCode = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { projectId } = req.params as { projectId: string };
        const { code } = req.body as { code: string };
    
        if (!userId) {
            return res
                .status(401)
                .json({
                    message: "Unauthorized user"
                });
        }
    
        if (!code) {
            return res
                .status(400)
                .json({
                    message: "Code is required to save the project"
                });
        }
    
        const project = await prisma.websiteProject.findUnique({
            where: {
                id: projectId,
                userId,
            }
        });
    
        if (!project) {
            return res
                .status(404)
                .json({
                    message: "Project not found"
                });
        }
    
        await prisma.websiteProject.update({
            where: {
                id: projectId,
            },
            data: {
                current_code: code,
                current_version_index: ''
            }
        });
    
        return res
            .status(200)
            .json({
                success: true,
                message: "Project code saved successfully",
            });
            
    } catch (error: any) {
        console.log(error.code || error.message);
        return res
            .status(500)
            .json({
                success: false,
                message: error.message,
            });
    }
};
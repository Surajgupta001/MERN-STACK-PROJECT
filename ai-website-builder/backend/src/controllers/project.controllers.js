import crypto from "crypto";
import Project from "../models/project.model.js";
import { generateProject } from "../services/ai.js";

// Generate a short hash for file content
function hashContent(content) {
    return crypto
        .createHash("md5")
        .update(content)
        .digest("hex")
        .slice(0, 12);
}

// POST /api/v1/projects
// Create a new project from AI prompt
export async function createProject(req, res) {
    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required",
            });
        }

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const project = await Project.create({
            name: "Planning Project",
            description: prompt.trim(),
            files: {},
            messages: [
                {
                    role: "user",
                    content: prompt.trim(),
                },
                {
                    role: "assistant",
                    content: "Planning project structure...",
                },
            ],
            version: 0,
            owner: req.user.userId,
            status: "pending",
            filePlanned: [],
            filesGenerated: [],
            currentFile: null,
        });

        // Start background generation
        runBackgroundGeneration(
            project._id.toString(),
            prompt.trim()
        ).catch((error) => {
            console.error(
                `[Background AI] Fatal generation error for project ${project._id}:`,
                error
            );
        });

        return res.status(201).json({
            success: true,
            _id: project._id,
            name: project.name,
            description: project.description,
            files: {},
            messages: project.messages,
            version: project.version,
            status: project.status,
            filePlanned: project.filePlanned,
            filesGenerated: project.filesGenerated,
            currentFile: project.currentFile,
            createdAt: project.createdAt,
        });
    } catch (error) {
        console.error("Create project error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create project",
        });
    }
}

// Background worker to progressively generate files
export async function runBackgroundGeneration(projectId, prompt) {
    // AI generation logic will be implemented here
    try {
        console.log(`[Background AI] Starting generation for project ${projectId} with prompt: ${prompt}`);
        const result = await generateProject(prompt, {
            onPlan: async (plan) => {
                console.log(`[Background AI] Project ${projectId} planning completed with ${plan.files.length} files.`);
                await Project.findByIdAndUpdate(projectId, {
                    status: "generating",
                });
                const fileList = plan.files.map((f) => `-\ ${f.path}\: ${f.description}`).join("\n");
                await Project.findByIdAndUpdate(projectId, {
                    name: plan.projectName || "Generated Project",
                    status: "generating",
                    filePlanned: plan.files,
                    $push: {
                        messages: {
                            role: "assistant",
                            content: `Project planning completed. Planned files:\n${fileList}`,
                            timestamp: new Date(),
                        }
                    }
                });
            },
            onFileStart: async (path) => {
                console.log(`[Background AI] Project ${projectId} started generating file: ${path}`);
                await Project.findByIdAndUpdate(projectId, {
                    currentFile: path,
                })
            },
            onFileComplete: async (path, code) => {
                console.log(`[Background AI] Project ${projectId} completed generating file: ${path}`);
                const project = await Project.findById(projectId);

                if (project) {
                    project.files = project.files || {};
                    project.files[path] = {
                        content: code,
                        hash: hashContent(code),
                    },
                        project.filesGenerated = [
                            ...(project.filesGenerated || []),
                            path,
                        ];
                    project.messages.push({
                        role: "assistant",
                        content: `File generated: ${path}`,
                        timestamp: new Date(),
                    });
                    project.currentFile = null;
                    project.markModified("files");
                    await project.save();
                }
            }
        });

        console.log(`[Background AI] Project ${projectId} generation completed. Finalizing project...`);
        const project = await Project.findById(projectId);
        if (project) {
            project.status = "completed";
            project.version = 1;
            if (result.description) {
                project.name = result.description;
            }
            project.messages.push({
                role: "assistant",
                content: "Project generation completed successfully.",
                timestamp: new Date(),
            });
            await project.save();
        }
    } catch (error) {
        console.error(`[Background AI] Error generating project ${projectId}:`, error);
        await Project.findByIdAndUpdate(projectId, {
            status: "failed",
            error: error.message,
            $push: {
                messages: {
                    role: "assistant",
                    content: `Project generation failed: ${error.message}`,
                    timestamp: new Date(),
                }
            }
        })
    }
}

// GET /api/v1/projects
// List all projects owned by the user
export async function listProjects(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const projects = await Project.find(
            { owner: req.user.userId },
            {
                name: 1,
                description: 1,
                version: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        ).sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            projects,
        });
    } catch (error) {
        console.error("List projects error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch projects",
        });
    }
}

// GET /api/v1/projects/:id
// Get full project details
export async function getProject(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const project = await Project.findOne({
            _id: req.params.id,
            owner: req.user.userId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        const filesObj = {};

        for (const [path, entry] of Object.entries(project.files || {})) {
            filesObj[path] =
                typeof entry === "string"
                    ? entry
                    : entry.content;
        }

        return res.status(200).json({
            success: true,
            _id: project._id,
            name: project.name,
            description: project.description,
            files: filesObj,
            messages: project.messages,
            version: project.version,
            status: project.status,
            filePlanned: project.filePlanned,
            filesGenerated: project.filesGenerated,
            currentFile: project.currentFile,
            published: project.published,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        });
    } catch (error) {
        console.error("Get project error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch project",
        });
    }
}

// DELETE /api/v1/projects/:id
// Delete a project
export async function deleteProject(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const result = await Project.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.userId,
        });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Delete project error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete project",
        });
    }
}

// PUT /api/v1/projects/:id/files
// Update project files manually
export async function updateProjectFiles(req, res) {
    try {
        const { files } = req.body;

        if (!files || typeof files !== "object" || Array.isArray(files)) {
            return res.status(400).json({
                success: false,
                message: "Valid files object is required",
            });
        }

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const project = await Project.findOne({
            _id: req.params.id,
            owner: req.user.userId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        const newFiles = {};

        for (const [path, content] of Object.entries(files)) {
            if (typeof content === "string") {
                newFiles[path] = {
                    content,
                    hash: hashContent(content),
                };
            }
        }

        project.files = newFiles;

        await project.save();

        const filesObj = {};

        for (const [path, entry] of Object.entries(project.files || {})) {
            filesObj[path] = entry.content;
        }

        return res.status(200).json({
            success: true,
            _id: project._id,
            name: project.name,
            description: project.description,
            files: filesObj,
            messages: project.messages,
            version: project.version,
            status: project.status,
            filePlanned: project.filePlanned,
            filesGenerated: project.filesGenerated,
            currentFile: project.currentFile,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        });
    } catch (error) {
        console.error("Update project files error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update project files",
        });
    }
}

// POST /api/v1/projects/:id/publish
// Mark a project as publicly published
export async function publishProject(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.userId },
            { published: true },
            { returnDocument: 'after' }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project published successfully",
            published: project.published,
        });
    } catch (error) {
        console.error("Publish project error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to publish project",
        });
    }
}

// GET /api/v1/projects/public/:id
// Get publicly published project without authentication
export async function getPublicProject(req, res) {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        if (!project.published) {
            return res.status(404).json({
                success: false,
                message: "This project is not published",
            });
        }

        const filesObj = {};

        for (const [path, entry] of Object.entries(project.files || {})) {
            filesObj[path] =
                typeof entry === "string"
                    ? entry
                    : entry.content;
        }

        return res.status(200).json({
            success: true,
            _id: project._id,
            name: project.name,
            description: project.description,
            files: filesObj,
            version: project.version,
        });
    } catch (error) {
        console.error("Get public project error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch public project",
        });
    }
}
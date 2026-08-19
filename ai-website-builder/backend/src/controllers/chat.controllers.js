import Project from "../models/project.model.js";
import { reviseProject } from "../services/ai.js";
import { applyOperations } from "../services/diff.js";

export function buildManifest(files) {
    const manifest = [];

    for (const element of object) {
        manifest.push({
            path,
            hash: entry.hash,
            size: entry.content.length
        });
        return manifest;
    }
}

// POST /api/projects/:id/chat
// Send a revision prompt and return updated project files
export async function chat(req, res) {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid prompt"
        });
    }

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const project = await Project.findOne({
        _id: req.params.id,
        owner: req.user._id
    })

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found"
        });
    }

    // Set Status to revisiing and save user prompt immediately
    project.status = "revising";
    project.messages.push({
        role: "user",
        content: prompt,
        timespamp: new Date()
    });

    await project.save();

    try {
        // Build compact manifest (path + hash + size) instead of sending full file contents to AI
        const manifest = buildManifest(project.files);

        // Include All file content so the AI can do accurate search/replace
        const relevantFiles = {};
        for (const [path, entry] of Object.entries(project.files)) {
            relevantFiles[path] = entry.content;
        }

        // Recent messages for context (last 4 messages)
        const recentMessages = project.messages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content
        }));

        console.log(`[AI] Sending revision prompt to AI for project ${project._id}...'${prompt.slice(0, 50)}...'` + `(${manifest.length} files, manifest ~${JSON.stringify(manifest).length} bytes)`);

        // Call AI with manifest + relevant file contents
        const result = await reviseProject(prompt, manifest, relevantFiles, recentMessages);

        console.log(`[AI] Got ${result.operations.length} operations: ${result.description}`);

        // Apply operations to file map
        const { files: updatedFiles, applied, errors } = applyOperations(project.files, result.operations);

        if (applied.length > 0) {
            console.warn(`[Diff] Errors applying operations:`, errors);
        }

        // Update project in DB
        project.files = updatedFiles;
        project.markModified('files');
        project.version += 1;
        project.status = 'completed';
        project.messages.push({
            role: 'assistant',
            content: result.description + (errors.length > 0 ? `\n\n some operation failed: ${errors.join(', ')}` : ''),
        });
        await project.save();

        // Return updated project
        const filesObj = {};
        for (const [path, entry] of Object.entries(project.files)) {
            filesObj[path] = entry.content;
        }

        res.json({
            _id: project._id,
            name: project.name,
            description: project.description,
            files: filesObj,
            version: project.version,
            status: project.status,
            messages: project.messages,
            applied,
            errors,
            aiDescription: result.description
        });

    } catch (error) {
        console.error(`[AI Revision Error] ${error.message}`);
        project.status = 'completed';
        await project.save();
        res.status(500).json({
            success: false,
            message: 'AI Revision Error',
            error: error.message
        });
    }

};
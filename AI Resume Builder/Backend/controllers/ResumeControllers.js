import imagekit from "../config/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";

// Controllers for creating a new resumes
// POST: /api/v1/resumes/create
export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        // create new resume
        const newResume = await Resume.create({
            userId,
            title
        })

        // return success response
        return res
        .status(201)
        .json({
            success: true,
            resume: newResume
        })

    } catch (error) {
        console.error("Error in createResume:", error);
        return res
        .status(400)
        .json({
            success: false,
            message: error.message
        })
    }
};

// Controllers for deleting a resume
// DELETE: /api/v1/resumes/delete
export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        await Resume.findOneAndDelete({
            userId,
            _id: resumeId
        });

        // return success response
        return res
        .status(200)
        .json({
            success: true,
            message: "Resume deleted successfully"
        })

    } catch (error) {
        console.error("Error in deleteResume:", error);
        return res
        .status(400)
        .json({
            success: false,
            message: error.message
        })
    }
};

// get user resume by id
// GET: /api/v1/resumes/get
export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        const resume = await Resume.findOne({
            userId,
            _id: resumeId
        })

        if (!resume) {
            return res
            .status(404)
            .json({
                success: false,
                message: "Resume not found"
            })
        }

        resume.__v = undefined; // hide __v field
        resume.createdAt = undefined; // hide createdAt field
        resume.updatedAt = undefined; // hide updatedAt field

        // return success response
        return res
        .status(200)
        .json({
            success: true,
            message: "Resume fetched successfully",
            resume
        })

    } catch (error) {
        console.error("Error in getResumeById:", error);
        return res
        .status(400)
        .json({
            success: false,
            message: error.message
        })
    }
};

// get resume by id public
// GET: /api/v1/resumes/public
export const getResumeByIdPublic = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOne({
            public: true,
            _id: resumeId
        });

        if (!resume) {
            return res
            .status(404)
            .json({
                success: false,
                message: "Resume not found"
            })
        }

        // return success response
        return res
        .status(200)
        .json({
            success: true,
            message: "Resume fetched successfully",
            resume
        })

    } catch (error) {
        console.error("Error in getResumeByIdPublic:", error);
        return res
        .status(400)
        .json({
            success: false,
            message: error.message
        })
    }
};

// Controllers for updating a resume
// PUT: /api/v1/resumes/update

export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.files;

        let resumeDataCopy = JSON.parse(resumeData);

        if (image) {
            const imageBufferData = fs.createReadStream(image.path);
            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: resume.png,
                folder: 'user-resume',
                transformation: {
                    pre: 'w-300,h-400,fo-face,z-0.75' + (removeBackground ? ',e-bgremove' : '')
                }
            });

            resumeDataCopy.personal_info.image = response.url;
        }

        const resume = await Resume.findOneAndUpdate({
            userId,
            _id: resumeId
        }, 
        resumeDataCopy,{
            new: true
        });

        // return success response
        return res
        .status(200)
        .json({
            success: true,
            message: "Resume updated successfully",
            resume
        })

    } catch (error) {
        console.error("Error in updateResume:", error);
        return res
        .status(400)
        .json({
            success: false,
            message: error.message
        })
    }
};
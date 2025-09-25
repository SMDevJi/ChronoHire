import express from "express";
import Interview from "../models/Interview.js";
import { generateAIQA, extractResumeText, evaluateAnswers } from "../utils/utils.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import authMiddleware from "../middleware/middleware.js";

const router = express.Router();


// Setup multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });




/**
 * Create new interview
 * POST /api/interviews/create
 */
router.post("/create", upload.single("resumeFile"), authMiddleware, async (req, res) => {
    try {
        const { role, description, yearsOfExperience, difficulty } = req.body;
        const userId = req.user.id
        console.log(userId, role, description, yearsOfExperience, difficulty)
        const resumeFile = req.file;



        // 1️⃣ Extract resume
        const resumeText = await extractResumeText(resumeFile.path);
        //console.log(resumeText)


        // 2️⃣ Generate 7 AI questions (5 job + 2 resume)
        const questions = await generateAIQA(role, description, resumeText, difficulty, yearsOfExperience);

        //console.log(questions)

        // 3️⃣ Create new interview
        const interview = new Interview({
            userId,
            role,
            description,
            resumeText,
            resumeUpdatedAt: new Date(),
            lastAttempt: {
                difficulty,
                yearsOfExperience,
                questions,
                overallEvaluation: null,
                overallScore: null,
                duration: 0
            },
            previousAttempts: []
        });

        await interview.save();

        res.status(201).json({
            success: true,
            message: "Interview created successfully",
            interviewId: interview._id,
            questions: interview.lastAttempt.questions
        });

    } catch (error) {
        console.error("Error creating interview:", error);
        res.status(500).json({ success: false, message: "Internal Server error" });
    }
});




/**
 * Get interview details
 * GET /api/interviews/:id
 */
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const interview = await Interview.findById(id);

        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }

        if (interview.userId != req.user.id) {
            return res.status(403).json({ success: false, message: "You are not allowed to get details of this interview!" });
        }

        res.status(200).json({
            success: true,
            interview: {
                role: interview.role,
                description: interview.description,
                lastAttempt: interview.lastAttempt,
                previousAttempts: interview.previousAttempts
            }
        });
    } catch (error) {
        console.error("Error fetching interview:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});





/**
 * Submit interview attempt (evaluate answers)
 * POST /api/interviews/submit/:id
 */
router.post("/submit/:id", authMiddleware,async (req, res) => {
    
    try {
        const { id } = req.params;
        const { answers, duration } = req.body;

        const interview = await Interview.findById(id);
        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }

        if(interview.userId!=req.user.id){
            return res.status(403).json({ success: false, message: "You are not allowed to submit this interview!" });
        }

        const currentAttempt = interview.lastAttempt;
        if (!currentAttempt) {
            return res.status(400).json({ success: false, message: "No attempt to submit" });
        }

        //console.log(id,answers,duration)
        // Merge answers into questions
        const answeredQuestions = currentAttempt.questions.map(q => {
            const ans = answers.find(a => a._id == q._id.toString());
            return {
                ...q.toObject(),
                transcript: ans?.transcript || ""
            };
        });

        //console.log(answeredQuestions)
        // // Evaluate with AI
        const { evaluatedQuestions, overallEvaluation, overallScore } = await evaluateAnswers(answeredQuestions);
        console.log(evaluatedQuestions, overallEvaluation, overallScore)

        // Move old evaluated attempt into previousAttempts
        if (currentAttempt.overallEvaluation) {
            interview.previousAttempts.push(currentAttempt);
        }

        // Save evaluated attempt as lastAttempt
        interview.lastAttempt = {
            ...currentAttempt.toObject(),
            questions: evaluatedQuestions,
            overallEvaluation,
            overallScore,
            duration,
            attemptDate: new Date()
        };

        await interview.save();

        res.status(200).json({
            success: true,
            message: "Interview submitted and evaluated successfully",
            evaluation: interview.lastAttempt
        });

    } catch (error) {
        console.error("Error submitting interview:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});





/**
 * Reattempt interview
 * POST /api/interviews/reattempt/:id
 */
router.post("/reattempt/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { difficulty, yearsOfExperience, resumeFile } = req.body;

        const interview = await Interview.findById(id);
        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }

        // If last attempt exists, move to previousAttempts
        if (interview.lastAttempt) {
            interview.previousAttempts.push(interview.lastAttempt);
        }

        // Update resume if new one provided
        let resumeText = interview.resumeText;
        if (resumeFile) {
            resumeText = await extractResumeText(resumeFile);
            interview.resumeText = resumeText;
            interview.resumeUpdatedAt = new Date();
        }

        // Generate new questions
        const questions = await generateAIQuestions(interview.role, interview.description, resumeText);

        // New attempt
        interview.lastAttempt = {
            difficulty,
            yearsOfExperience,
            questions,
            overallEvaluation: null,
            overallScore: null,
            duration: 0,
            attemptDate: new Date()
        };

        await interview.save();

        res.status(201).json({
            success: true,
            message: "New attempt created successfully",
            interviewId: interview._id,
            newAttemptId: interview.lastAttempt._id,
            questions: interview.lastAttempt.questions
        });

    } catch (error) {
        console.error("Error reattempting interview:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;

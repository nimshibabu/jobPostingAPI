const express = require("express");
const router = express.Router();
const Job = require("../models/jobsModel");
const Company = require("../models/companyModel");
const User = require("../models/userModel");
const { authenticateToken } = require("../utils/auth");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../uploads/resumes");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `${timestamp}-${file.originalname}`);
    }
});

// File filter to allow only PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });


router.post("/", authenticateToken, async (req, res) => {
    const { role, companyId, id } = req.user;
    console.log('req.user', req.user)

    if (role !== "recruiter") {
        return res.status(403).json({ error: "Access denied! Only recruiters can post jobs." });
    }
    try { res.status(201).json(await Job.create({ ...req.body, createdBy: id, companyId: companyId })); }
    catch (error) { res.status(400).json({ error: error.message }); }
});

router.get("/", authenticateToken, async (req, res) => {
    try {
        const { role, companyId } = req.user; // Extract user details from token

        let jobs;

        if (role === "admin") {
            // Admin can view all jobs
            jobs = await Job.findAll({});
        } else if (role === "recruiter") {
            // Recruiter can view only jobs from their company
            if (!companyId) {
                return res.status(403).json({ error: "Recruiter must be linked to a company!" });
            }
            jobs = await Job.findAll({ where: { companyId: companyId }});
        } else {
            // Job seekers can view all jobs
            jobs = await Job.findAll({   });
        }

        res.json(jobs);
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    const job = await Job.findByPk(req.params.id, { include: [Company, User] });
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
});

router.put("/:id", authenticateToken, async (req, res) => {

    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (req.user.id !== job.createdBy) {
        return res.status(403).json({ error: "You are not authorized to update this job." });
    }
    try {
        await job.update(req.body);
        res.json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/:id", authenticateToken, async (req, res) => {
    const job = await Job.findByPk(req.params.id);
    if (req.user.id !== job.createdBy) {
        return res.status(403).json({ error: "You are not authorized to update this job." });
    }
    if (!job) return res.status(404).json({ error: "Job not found" });

    await job.destroy();
    res.json({ message: "Job deleted successfully" });
});

router.put('/:id/uploadResume', authenticateToken, upload.single("resume"), async(req, res) => {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
        return res.status(404).json({ error: "Job not found" });
    }

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded. Only PDF files are allowed." });
    }

    // Construct resume file path
    const resumePath = `/uploads/resumes/${req.file.filename}`;

    // Update applied_users and resumes fields
    const appliedUsers = job.appliedUsers ? JSON.parse(job.appliedUsers) : [];
    const resumes = job.resumes ? JSON.parse(job.resumes) : [];

    // Add new user ID and resume link
    appliedUsers.push(req.user.id);
    resumes.push({ userId: req.user.id, resume: resumePath });

    await job.update({
        applied_users: JSON.stringify(appliedUsers),
        resumes: JSON.stringify(resumes)
    });

    res.json({ message: "Resume uploaded successfully", resumePath });
})

module.exports = router;

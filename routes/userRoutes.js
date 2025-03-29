const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { authenticateToken } = require("../utils/auth");

const router = express.Router();

router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;


        if (req.user.id !== parseInt(userId)) {
            return res.status(403).json({ message: "Unauthorized to update this user" });
        }

        const { firstName, lastName, email, phoneNumber, skills, highestDegree } = req.body;

        let user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        await user.update({
            firstName,
            lastName,
            email,
            phoneNumber,
            skills,
            highestDegree
        });

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { email, password, firstName, lastName,phoneNumber  } = req.body;
        if (!password) return res.status(400).json({ error: "Password is required" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({  email, password: hashedPassword, firstName, lastName, phoneNumber, companyId:0 });
        res.status(201).json({ message: "User created successfully", userId: user.id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
});

router.post('/login', async(req, res) => {

})

module.exports = router;

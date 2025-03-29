const express = require("express");
const router = express.Router();
const Company = require("../models/companyModel");
const User = require("../models/userModel");
const bcrypt = require('bcryptjs')

router.post("/", async (req, res) => {
    try { 
        const company = await Company.create(req.body);
        console.log('company', company.dataValues.id)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin', salt);
        const user = await User.create({email:`hr@${req.body.email.split('@')[1]}`, password:hashedPassword, role:"recruiter", companyId:company.dataValues.id});
        res.status(201).json(company); 
    } 
    catch (error) {
        console.log('error', error)
        res.status(400).json({ error: error.message }); }
});

router.get("/", async (req, res) => res.json(await Company.findAll()));

module.exports = router;

const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Use environment variables

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, role:user.role, companyId: user.companyId || null }, JWT_SECRET, { expiresIn: "24h" });
};

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = { generateToken, authenticateToken };

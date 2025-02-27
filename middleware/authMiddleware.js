
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ error: "Access denied. No token provided" });
    }

    const token = authHeader.split(" ")[1]; 

    try {
        const verified = jwt.verify(token, "secret_key");
        console.log("Verified User:", verified); 

        req.user = verified;
        req.userId = verified.userId;  

        next();
    } catch (err) {
        console.error("Token Verification Failed:", err.message);
        res.status(401).json({ error: "Invalid or expired token" });
    }
};


const isAdmin = (req, res, next) => {
    console.log("Checking Admin Role:", req.user?.role); 

    if (req.user && req.user.role === "admin") {
        console.log("Admin Access Granted");
        next();
    } else {
        console.log("Access Denied. User Role:", req.user?.role);
        res.status(403).json({ error: "Access denied, admin only" });
    }
};

module.exports = { verifyToken, isAdmin };


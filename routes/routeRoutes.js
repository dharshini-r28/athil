const express = require("express");
const router = express.Router();
const { addRoute, updateRoute, deleteRoute } = require("../controllers/routeController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");


router.post("/add", verifyToken, isAdmin, addRoute);
router.put("/update/:id", verifyToken, isAdmin, updateRoute);
router.delete("/delete/:id", verifyToken, isAdmin, deleteRoute);

module.exports = router;

const express = require("express");
const router = express.Router();
const { addBus, updateBus, deleteBus, searchBuses } = require("../controllers/busController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/add", verifyToken, isAdmin, addBus);
router.put("/update/:id", verifyToken, isAdmin, updateBus);
router.delete("/delete/:id", verifyToken, isAdmin, deleteBus);

router.get("/search", verifyToken, searchBuses);

module.exports = router;

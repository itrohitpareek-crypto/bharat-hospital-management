const express = require("express");
const router = express.Router();
const { getLabTests, createLabTest, updateLabTest, deleteLabTest } = require("../controllers/labController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, getLabTests);
router.post("/", protect, authorize("admin", "doctor"), createLabTest);
router.put("/:id", protect, authorize("admin"), updateLabTest);
router.delete("/:id", protect, authorize("admin"), deleteLabTest);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getBills, createBill, updateBill, deleteBill } = require("../controllers/billController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, getBills);
router.post("/", protect, authorize("admin"), createBill);
router.put("/:id", protect, authorize("admin"), updateBill);
router.delete("/:id", protect, authorize("admin"), deleteBill);

module.exports = router;

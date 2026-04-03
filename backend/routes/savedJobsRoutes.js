const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

const {
    saveJob,
    unsaveJob,
    getMySavedJobs,
} = require("../controllers/savedJobController");


router.get("/my", protect, getMySavedJobs);

router.post("/:jobId", protect, saveJob);
router.delete("/:jobId", protect, unsaveJob);

module.exports = router;
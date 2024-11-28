const express = require("express");
const router = express.Router();
const habitControllers = require("../controllers/habitControllers");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);
router.get("/", habitControllers.getAllHabits);
router.post("/", habitControllers.createHabit);
router.get("/:id", habitControllers.getHabit);
router.delete("/:id", habitControllers.deleteHabit);

module.exports = router;

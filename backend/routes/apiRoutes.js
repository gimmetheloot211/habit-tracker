const express = require("express");
const router = express.Router();
const apiControllers = require("../controllers/apiControllers");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);
router.get("/apininja", apiControllers.getApiData);


module.exports = router;

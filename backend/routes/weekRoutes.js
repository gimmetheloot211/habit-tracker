const express = require('express');
const router = express.Router();
const weekControllers = require('../controllers/weekControllers');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);
router.get('/id/:id', weekControllers.getWeek);
router.patch('/id', weekControllers.updateWeek);
router.patch('/', weekControllers.updateWeekData);
router.get('/year/:year', weekControllers.getWeeks);

module.exports = router;
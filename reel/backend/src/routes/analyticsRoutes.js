const express = require('express');
const {
    getGroupAnalytics,
} = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/').get(protect, getGroupAnalytics);

module.exports = router;

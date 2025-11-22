const express = require('express');
const {
    getSettlements,
    recordSettlement,
} = require('../controllers/settlementController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/').get(protect, getSettlements).post(protect, recordSettlement);

module.exports = router;

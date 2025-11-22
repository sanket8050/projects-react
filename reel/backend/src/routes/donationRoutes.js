const express = require('express');
const {
    createDonation,
    getDonations,
} = require('../controllers/donationController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/').post(protect, createDonation).get(protect, getDonations);

module.exports = router;

const express = require('express');
const {
    createGroup,
    getUserGroups,
    getGroupById,
    addMember,
} = require('../controllers/groupController');
const { protect } = require('../middlewares/authMiddleware');

const departmentRoutes = require('./departmentRoutes');
const donationRoutes = require('./donationRoutes');
const analyticsRoutes = require('./analyticsRoutes');

const router = express.Router();

router.use('/:groupId/departments', departmentRoutes);
router.use('/:groupId/donations', donationRoutes);
router.use('/:groupId/analytics', analyticsRoutes);

router.route('/').post(protect, createGroup).get(protect, getUserGroups);
router.route('/:id').get(protect, getGroupById);
router.route('/:id/members').post(protect, addMember);

module.exports = router;

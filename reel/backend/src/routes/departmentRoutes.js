const express = require('express');
const {
    createDepartment,
    getDepartments,
} = require('../controllers/departmentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/').post(protect, createDepartment).get(protect, getDepartments);

module.exports = router;

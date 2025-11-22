const express = require('express');
const {
    addTransaction,
    getGroupTransactions,
    deleteTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true }); // Enable access to params from parent router

router.route('/').post(protect, addTransaction);
router.route('/:id').delete(protect, deleteTransaction);
// Note: getGroupTransactions is usually mounted under /api/groups/:groupId/transactions

module.exports = router;

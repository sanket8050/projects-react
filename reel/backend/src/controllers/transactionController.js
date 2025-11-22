const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Add a new transaction (expense)
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res) => {
    const {
        title,
        amount,
        groupId,
        payerId,
        splitType,
        participants, // Array of { userId, amountOwed }
        category,
        date,
    } = req.body;

    try {
        // Validation: Ensure total split amount equals total amount (approx for float)
        const totalSplit = participants.reduce((acc, p) => acc + p.amountOwed, 0);
        if (Math.abs(totalSplit - amount) > 0.01) {
            return res.status(400).json({ message: 'Split amounts do not match total amount' });
        }

        const transaction = await prisma.transaction.create({
            data: {
                title,
                amount,
                date: date || new Date(),
                category,
                splitType: splitType || 'EQUAL',
                payerId: payerId || req.user.id,
                groupId,
                participants: {
                    create: participants.map((p) => ({
                        userId: p.userId,
                        amountOwed: p.amountOwed,
                        amountPaid: 0, // Default 0, assuming payer paid the full transaction amount externally or recorded here
                    })),
                },
            },
            include: {
                participants: {
                    include: {
                        user: { select: { id: true, name: true, avatarUrl: true } },
                    },
                },
                payer: { select: { id: true, name: true, avatarUrl: true } },
            },
        });

        // TODO: Emit socket event for real-time update
        const io = req.app.get('io');
        if (io) {
            io.to(groupId).emit('new-transaction', transaction);
        }

        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get transactions for a group
// @route   GET /api/groups/:groupId/transactions
// @access  Private
const getGroupTransactions = async (req, res) => {
    const { groupId } = req.params;

    try {
        const transactions = await prisma.transaction.findMany({
            where: { groupId },
            include: {
                payer: { select: { id: true, name: true, avatarUrl: true } },
                participants: {
                    include: {
                        user: { select: { id: true, name: true, avatarUrl: true } },
                    },
                },
            },
            orderBy: { date: 'desc' },
        });

        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id },
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Check if user is payer or admin (simplified: only payer can delete for now)
        if (transaction.payerId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this transaction' });
        }

        await prisma.transaction.delete({
            where: { id },
        });

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.to(transaction.groupId).emit('delete-transaction', id);
        }

        res.json({ message: 'Transaction removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addTransaction,
    getGroupTransactions,
    deleteTransaction,
};

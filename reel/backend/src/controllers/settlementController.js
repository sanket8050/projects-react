const { PrismaClient } = require('@prisma/client');
const { calculateSettlements } = require('../utils/settlementAlgo');

const prisma = new PrismaClient();

// @desc    Get settlement suggestions for a group
// @route   GET /api/groups/:groupId/settlements
// @access  Private
const getSettlements = async (req, res) => {
    const { groupId } = req.params;

    try {
        // Fetch all transactions for the group
        const transactions = await prisma.transaction.findMany({
            where: { groupId },
            include: {
                participants: true,
            },
        });

        // Fetch group members
        const groupMembers = await prisma.groupMember.findMany({
            where: { groupId },
        });

        // Calculate settlements
        const suggestions = calculateSettlements(transactions, groupMembers);

        // Enrich with user details
        const enrichedSuggestions = await Promise.all(
            suggestions.map(async (s) => {
                const fromUser = await prisma.user.findUnique({
                    where: { id: s.from },
                    select: { id: true, name: true, avatarUrl: true },
                });
                const toUser = await prisma.user.findUnique({
                    where: { id: s.to },
                    select: { id: true, name: true, avatarUrl: true },
                });
                return { ...s, from: fromUser, to: toUser };
            })
        );

        res.json(enrichedSuggestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Record a settlement payment
// @route   POST /api/settlements
// @access  Private
const recordSettlement = async (req, res) => {
    const { groupId, payerId, receiverId, amount } = req.body;

    try {
        const settlement = await prisma.settlement.create({
            data: {
                groupId,
                payerId,
                receiverId,
                amount,
                isPaid: true,
            },
        });

        // Note: Recording a settlement usually means we need to reflect this in the balances.
        // The simplest way is to treat a settlement as a transaction where Payer pays Receiver.
        // Or, our algorithm should account for 'Settlement' records if we want to keep history.
        // Alternatively, we can just add a Transaction of type 'SETTLEMENT' (if we had that enum).
        // For now, let's add a Transaction to balance the books.

        await prisma.transaction.create({
            data: {
                title: 'Settlement Payment',
                amount: amount,
                payerId: payerId, // Payer pays
                groupId: groupId,
                splitType: 'EXACT',
                category: 'Settlement',
                participants: {
                    create: [
                        {
                            userId: receiverId, // Receiver "owes" this amount (conceptually reversing the debt)
                            amountOwed: amount,
                        },
                    ],
                },
            },
        });

        res.status(201).json(settlement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getSettlements,
    recordSettlement,
};

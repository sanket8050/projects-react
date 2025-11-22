const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Record a donation
// @route   POST /api/groups/:groupId/donations
// @access  Private
const createDonation = async (req, res) => {
    const { amount, message, paymentMethod } = req.body;
    const { groupId } = req.params;

    try {
        const donation = await prisma.donation.create({
            data: {
                amount,
                message,
                paymentMethod,
                groupId,
                donorId: req.user.id,
            },
            include: {
                donor: {
                    select: { id: true, name: true, avatarUrl: true },
                },
            },
        });

        res.status(201).json(donation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get donations for a group
// @route   GET /api/groups/:groupId/donations
// @access  Private
const getDonations = async (req, res) => {
    const { groupId } = req.params;

    try {
        const donations = await prisma.donation.findMany({
            where: { groupId },
            include: {
                donor: {
                    select: { id: true, name: true, avatarUrl: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Calculate total donations
        const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

        res.json({ donations, totalAmount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createDonation,
    getDonations,
};

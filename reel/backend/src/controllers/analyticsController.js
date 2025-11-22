const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get analytics for a group
// @route   GET /api/groups/:groupId/analytics
// @access  Private
const getGroupAnalytics = async (req, res) => {
    const { groupId } = req.params;

    try {
        // 1. Total Spending
        const transactions = await prisma.transaction.findMany({
            where: { groupId },
            include: {
                department: true,
            },
        });

        const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);

        // 2. Category-wise Spending
        const categorySpending = {};
        transactions.forEach((t) => {
            const category = t.category || 'Uncategorized';
            categorySpending[category] = (categorySpending[category] || 0) + t.amount;
        });

        // 3. Department-wise Spending
        const departmentSpending = {};
        transactions.forEach((t) => {
            if (t.department) {
                const deptName = t.department.name;
                departmentSpending[deptName] = (departmentSpending[deptName] || 0) + t.amount;
            }
        });

        // 4. Monthly Trends (Last 6 months)
        const monthlyTrends = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            monthlyTrends[monthKey] = 0;
        }

        transactions.forEach((t) => {
            const date = new Date(t.date);
            // Only consider if within last 6 months approx (simplified check)
            const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            if (monthlyTrends[monthKey] !== undefined) {
                monthlyTrends[monthKey] += t.amount;
            }
        });

        res.json({
            totalSpending,
            categorySpending: Object.entries(categorySpending).map(([name, value]) => ({ name, value })),
            departmentSpending: Object.entries(departmentSpending).map(([name, value]) => ({ name, value })),
            monthlyTrends: Object.entries(monthlyTrends).map(([name, value]) => ({ name, value })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getGroupAnalytics,
};

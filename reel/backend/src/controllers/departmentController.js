const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a new department
// @route   POST /api/groups/:groupId/departments
// @access  Private (Admin only usually, but open for now)
const createDepartment = async (req, res) => {
    const { name, description } = req.body;
    const { groupId } = req.params;

    try {
        const department = await prisma.department.create({
            data: {
                name,
                description,
                groupId,
            },
        });

        res.status(201).json(department);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get departments for a group
// @route   GET /api/groups/:groupId/departments
// @access  Private
const getDepartments = async (req, res) => {
    const { groupId } = req.params;

    try {
        const departments = await prisma.department.findMany({
            where: { groupId },
            include: {
                _count: {
                    select: { transactions: true },
                },
            },
        });

        res.json(departments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createDepartment,
    getDepartments,
};

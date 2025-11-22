const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
const createGroup = async (req, res) => {
    const { name, description, type, currency } = req.body;

    try {
        const group = await prisma.group.create({
            data: {
                name,
                description,
                type: type || 'FRIENDS',
                currency: currency || 'USD',
                ownerId: req.user.id,
                members: {
                    create: {
                        userId: req.user.id,
                        role: 'ADMIN',
                    },
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, avatarUrl: true },
                        },
                    },
                },
            },
        });

        res.status(201).json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user's groups
// @route   GET /api/groups
// @access  Private
const getUserGroups = async (req, res) => {
    try {
        const groups = await prisma.group.findMany({
            where: {
                members: {
                    some: {
                        userId: req.user.id,
                    },
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatarUrl: true },
                        },
                    },
                },
                _count: {
                    select: { transactions: true },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        res.json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single group details
// @route   GET /api/groups/:id
// @access  Private
const getGroupById = async (req, res) => {
    try {
        const group = await prisma.group.findUnique({
            where: { id: req.params.id },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, avatarUrl: true },
                        },
                    },
                },
                departments: true,
            },
        });

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if user is member
        const isMember = group.members.some((member) => member.userId === req.user.id);
        if (!isMember) {
            return res.status(403).json({ message: 'Not authorized to view this group' });
        }

        res.json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add member to group
// @route   POST /api/groups/:id/members
// @access  Private
const addMember = async (req, res) => {
    const { email } = req.body;
    const groupId = req.params.id;

    try {
        const group = await prisma.group.findUnique({
            where: { id: groupId },
            include: { members: true },
        });

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if requester is admin (optional, depending on requirements)
        // For now allow any member to invite? Or strictly admin? 
        // Requirement says "Invite system", usually admin only or open. Let's stick to basic member add for now.

        const userToAdd = await prisma.user.findUnique({
            where: { email },
        });

        if (!userToAdd) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isAlreadyMember = group.members.some((m) => m.userId === userToAdd.id);
        if (isAlreadyMember) {
            return res.status(400).json({ message: 'User is already a member' });
        }

        const newMember = await prisma.groupMember.create({
            data: {
                groupId,
                userId: userToAdd.id,
                role: 'MEMBER',
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true, avatarUrl: true },
                },
            },
        });

        res.status(201).json(newMember);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createGroup,
    getUserGroups,
    getGroupById,
    addMember,
};

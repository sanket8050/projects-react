/**
 * Calculates the minimum number of transactions to settle debts in a group.
 * @param {Array} transactions - List of transactions in the group
 * @param {Array} groupMembers - List of members in the group
 * @returns {Array} - List of settlement suggestions { from: userId, to: userId, amount: number }
 */
const calculateSettlements = (transactions, groupMembers) => {
    const balances = {};

    // Initialize balances
    groupMembers.forEach((member) => {
        balances[member.userId] = 0;
    });

    // Calculate net balances
    transactions.forEach((txn) => {
        const payerId = txn.payerId;
        const amount = txn.amount;

        // Payer paid the full amount, so they are owed this amount (initially)
        // But we need to subtract what they themselves owe if they are a participant?
        // Usually, the payer is also a participant in the split.
        // If payer is NOT in participants, they paid for others.
        // If payer IS in participants, they paid for everyone including themselves.

        // Let's look at how we store data:
        // Transaction has participants. Each participant has amountOwed.
        // Payer paid 'amount'.

        // Balance change for Payer: +amount (they paid out, so group owes them)
        // Balance change for Participant: -amountOwed (they consumed, so they owe group)

        if (balances[payerId] !== undefined) {
            balances[payerId] += amount;
        }

        txn.participants.forEach((p) => {
            if (balances[p.userId] !== undefined) {
                balances[p.userId] -= p.amountOwed;
            }
        });
    });

    // Separate into debtors and creditors
    const debtors = [];
    const creditors = [];

    Object.keys(balances).forEach((userId) => {
        const balance = balances[userId];
        if (balance < -0.01) {
            debtors.push({ userId, amount: balance });
        } else if (balance > 0.01) {
            creditors.push({ userId, amount: balance });
        }
    });

    // Sort by magnitude (descending) to optimize matching
    debtors.sort((a, b) => a.amount - b.amount); // Ascending (most negative first)
    creditors.sort((a, b) => b.amount - a.amount); // Descending (most positive first)

    const settlements = [];
    let i = 0; // debtor index
    let j = 0; // creditor index

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        // The amount to settle is the minimum of the absolute debt and the credit
        const amount = Math.min(Math.abs(debtor.amount), creditor.amount);

        // Record settlement
        settlements.push({
            from: debtor.userId,
            to: creditor.userId,
            amount: parseFloat(amount.toFixed(2)),
        });

        // Update remaining balances
        debtor.amount += amount;
        creditor.amount -= amount;

        // Check if settled (using small epsilon for float comparison)
        if (Math.abs(debtor.amount) < 0.01) {
            i++;
        }
        if (creditor.amount < 0.01) {
            j++;
        }
    }

    return settlements;
};

module.exports = { calculateSettlements };

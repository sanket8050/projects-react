import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useGroupStore from '../store/useGroupStore';
import useTransactionStore from '../store/useTransactionStore';
import Navbar from '../components/Navbar';
import AddExpenseModal from '../components/AddExpenseModal';
import { Plus, DollarSign, Users, Settings, BarChart2 } from 'lucide-react';

import DonationTab from '../components/DonationTab';
import SettlementTab from '../components/SettlementTab';
import AnalyticsTab from '../components/AnalyticsTab';

const GroupView = () => {
    const { id } = useParams();
    const { currentGroup, fetchGroupById, isLoading: groupLoading } = useGroupStore();
    const { transactions, fetchTransactions, isLoading: txnLoading } = useTransactionStore();
    const [activeTab, setActiveTab] = useState('expenses');
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

    useEffect(() => {
        if (id) {
            fetchGroupById(id);
            fetchTransactions(id);
        }
    }, [id, fetchGroupById, fetchTransactions]);

    if (groupLoading || !currentGroup) {
        return <div className="text-center py-10">Loading group...</div>;
    }

    const tabs = ['expenses', 'balances', 'members', 'analytics'];
    if (currentGroup.type === 'ORGANIZATION') {
        tabs.push('donations');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="px-4 py-6 sm:px-0 bg-white shadow rounded-lg mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{currentGroup.name}</h1>
                            <p className="text-sm text-gray-500 mt-1">{currentGroup.type} Group</p>
                        </div>
                        <div className="flex space-x-3">
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                <Settings className="h-5 w-5 mr-2" />
                                Settings
                            </button>
                            <button
                                onClick={() => setShowAddExpenseModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add Expense
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8 px-4" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${activeTab === tab
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="px-4 sm:px-0">
                    {activeTab === 'expenses' && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200">
                                {transactions.length === 0 ? (
                                    <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                                        No expenses yet.
                                    </li>
                                ) : (
                                    transactions.map((txn) => (
                                        <li key={txn.id}>
                                            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                            <DollarSign className="h-6 w-6 text-indigo-600" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-indigo-600 truncate">
                                                                {txn.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                Paid by {txn.payer.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                                                        <div className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            {currentGroup.currency} {txn.amount.toFixed(2)}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {new Date(txn.date).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    )}

                    {activeTab === 'members' && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200">
                                {currentGroup.members.map((member) => (
                                    <li key={member.id} className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                <Users className="h-6 w-6 text-gray-500" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{member.user.name}</div>
                                                <div className="text-sm text-gray-500">{member.user.email}</div>
                                            </div>
                                            <div className="ml-auto">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {member.role}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {activeTab === 'balances' && (
                        <SettlementTab groupId={id} />
                    )}

                    {activeTab === 'donations' && (
                        <DonationTab groupId={id} />
                    )}

                    {activeTab === 'analytics' && (
                        <AnalyticsTab groupId={id} />
                    )}
                </div>
            </main>
            <AddExpenseModal
                isOpen={showAddExpenseModal}
                onClose={() => setShowAddExpenseModal(false)}
                groupId={id}
            />
        </div>
    );
};

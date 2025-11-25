import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useGroupStore from '../store/useGroupStore';
import Navbar from '../components/Navbar';
import CreateGroupModal from '../components/CreateGroupModal';
import { Plus, Users, Building } from 'lucide-react';

const Dashboard = () => {
    const { groups, fetchGroups, isLoading } = useGroupStore();
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
                        <button
                            onClick={() => setShowCreateGroupModal(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            New Group
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10">Loading groups...</div>
                    ) : groups.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            You don't have any groups yet. Create one to get started!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {groups.map((group) => (
                                <Link
                                    key={group.id}
                                    to={`/groups/${group.id}`}
                                    className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center">
                                            <div className={`flex-shrink-0 rounded-md p-3 ${group.type === 'ORGANIZATION' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                                                {group.type === 'ORGANIZATION' ? (
                                                    <Building className={`h-6 w-6 ${group.type === 'ORGANIZATION' ? 'text-purple-600' : 'text-blue-600'}`} />
                                                ) : (
                                                    <Users className="h-6 w-6 text-blue-600" />
                                                )}
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    {group.type} Group
                                                </dt>
                                                <dd className="flex items-baseline">
                                                    <div className="text-lg font-medium text-gray-900">
                                                        {group.name}
                                                    </div>
                                                </dd>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="text-sm text-gray-500">
                                                {group.members?.length || 0} members
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <CreateGroupModal
                isOpen={showCreateGroupModal}
                onClose={() => setShowCreateGroupModal(false)}
            />
        </div>
    );
};

export default Dashboard;

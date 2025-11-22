                        >
    <Plus className="h-5 w-5 mr-2" />
                            New Group
                        </button >
                    </div >

{
    isLoading?(
                        <div className = "text-center py-10" > Loading groups...</div>
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
                </div >
            </main >
    {/* Create Group Modal would go here */ }
        </div >
    );
};

export default Dashboard;

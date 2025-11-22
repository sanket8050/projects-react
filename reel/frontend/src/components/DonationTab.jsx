import { useEffect, useState } from 'react';
import api from '../services/api';

const DonationTab = ({ groupId }) => {
    const [donations, setDonations] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const { data } = await api.get(`/groups/${groupId}/donations`);
                setDonations(data.donations);
                setTotalAmount(data.totalAmount);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch donations', error);
                setIsLoading(false);
            }
        };

        fetchDonations();
    }, [groupId]);

    if (isLoading) return <div>Loading donations...</div>;

    return (
        <div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Total Donations</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Total funds collected for this organization.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-2xl font-bold text-green-600">
                                ${totalAmount.toFixed(2)}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {donations.length === 0 ? (
                        <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                            No donations yet.
                        </li>
                    ) : (
                        donations.map((donation) => (
                            <li key={donation.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                            <span className="text-green-600 font-bold">$</span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {donation.donor.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {donation.message || 'No message'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                                        <div className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            ${donation.amount.toFixed(2)}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(donation.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default DonationTab;

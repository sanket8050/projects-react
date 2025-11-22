import { useEffect, useState } from 'react';
import api from '../services/api';
import { ArrowRight, CheckCircle } from 'lucide-react';

const SettlementTab = ({ groupId }) => {
    const [settlements, setSettlements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const fetchSettlements = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get(`/settlements/${groupId}`);
            setSettlements(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch settlements', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettlements();
    }, [groupId]);

    const handleSettle = async (settlement) => {
        setProcessingId(`${settlement.from}-${settlement.to}`);
        try {
            await api.post('/settlements', {
                groupId,
                payerId: settlement.from,
                receiverId: settlement.to,
                amount: settlement.amount,
            });
            // Refresh settlements after successful payment
            fetchSettlements();
        } catch (error) {
            console.error('Failed to record settlement', error);
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) return <div>Loading settlements...</div>;

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Suggested Settlements</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    The most efficient way to settle all debts in the group.
                </p>
            </div>
            <ul className="divide-y divide-gray-200">
                {settlements.length === 0 ? (
                    <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                        No settlements needed. Everyone is squared up!
                    </li>
                ) : (
                    settlements.map((settlement, index) => (
                        <li key={index} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                                            {settlement.fromName.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{settlement.fromName}</div>
                                        <div className="text-sm text-gray-500">owes</div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-400 mx-4" />
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                                            {settlement.toName.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{settlement.toName}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-lg font-bold text-gray-900 mr-6">
                                        ${settlement.amount.toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => handleSettle(settlement)}
                                        disabled={processingId === `${settlement.from}-${settlement.to}`}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                                    >
                                        {processingId === `${settlement.from}-${settlement.to}` ? 'Processing...' : 'Mark Paid'}
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default SettlementTab;

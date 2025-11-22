import { create } from 'zustand';
import api from '../services/api';

const useTransactionStore = create((set) => ({
    transactions: [],
    isLoading: false,
    error: null,

    fetchTransactions: async (groupId) => {
        set({ isLoading: true });
        try {
            const { data } = await api.get(`/groups/${groupId}/transactions`);
            set({ transactions: data, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch transactions', isLoading: false });
        }
    },

    addTransaction: async (transactionData) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/transactions', transactionData);
            set((state) => ({
                transactions: [data, ...state.transactions],
                isLoading: false
            }));
            return true;
        } catch (error) {
            set({ error: 'Failed to add transaction', isLoading: false });
            return false;
        }
    },
}));

export default useTransactionStore;

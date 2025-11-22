import { create } from 'zustand';
import api from '../services/api';

const useGroupStore = create((set, get) => ({
    groups: [],
    currentGroup: null,
    isLoading: false,
    error: null,

    fetchGroups: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get('/groups');
            set({ groups: data, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch groups', isLoading: false });
        }
    },

    fetchGroupById: async (id) => {
        set({ isLoading: true });
        try {
            const { data } = await api.get(`/groups/${id}`);
            set({ currentGroup: data, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch group details', isLoading: false });
        }
    },

    createGroup: async (groupData) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/groups', groupData);
            set((state) => ({
                groups: [data, ...state.groups],
                isLoading: false
            }));
            return data;
        } catch (error) {
            set({ error: 'Failed to create group', isLoading: false });
            return null;
        }
    },
}));

export default useGroupStore;

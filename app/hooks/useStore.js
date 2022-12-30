import create from 'zustand';
import { getUserData } from '../api/firebase';

export const useStore = create((set) => ({
  userData: {},
  setUserData: (userData) => set((state) => ({ ...state, userData })),
  fetchUserData: async (userID) => {
    await getUserData(userID).then((res) => set({ userData: res }));
  },
}));

import { create } from 'zustand';

interface ProfileState {
    address: string | null;
    username: string | null;
    level: number;
    experience: number;
    setProfile: (address: string, username: string) => void;
    addExperience: (amount: number) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
    address: null,
    username: null,
    level: 1,
    experience: 0,
    setProfile: (address, username) => set({ address, username }),
    addExperience: (amount) => set((state) => {
        const newExperience = state.experience + amount;
        const newLevel = Math.floor(newExperience / 1000) + 1;
        return {
            experience: newExperience,
            level: newLevel
        };
    })
}));
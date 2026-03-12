import { create } from 'zustand';

interface SnackbarState {
  isVisible: boolean;
  showSnackbar: () => void;
  hideSnackbar: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
  isVisible: false,
  showSnackbar: () => {
    set({ isVisible: true });
    setTimeout(() => set({ isVisible: false }), 3000);
  },
  hideSnackbar: () => set({ isVisible: false }),
}));

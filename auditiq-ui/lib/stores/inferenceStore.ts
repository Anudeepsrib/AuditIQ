import { create } from 'zustand';
import type { ExtractionResponse, InferenceHistoryItem } from '../types/inference';

interface InferenceState {
  history: InferenceHistoryItem[];
  
  // Actions
  addToHistory: (item: InferenceHistoryItem) => void;
  clearHistory: () => void;
  getHistoryItem: (id: string) => InferenceHistoryItem | undefined;
  removeFromHistory: (id: string) => void;
}

const MAX_HISTORY_ITEMS = 5;

export const useInferenceStore = create<InferenceState>()(
  (set, get) => ({
    history: [],

    addToHistory: (item) => {
      set((state) => {
        const newHistory = [item, ...state.history].slice(0, MAX_HISTORY_ITEMS);
        return { history: newHistory };
      });
    },

    clearHistory: () => set({ history: [] }),

    getHistoryItem: (id) => {
      return get().history.find((item) => item.id === id);
    },

    removeFromHistory: (id) => {
      set((state) => ({
        history: state.history.filter((item) => item.id !== id),
      }));
    },
  })
);

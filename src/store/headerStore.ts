import { create } from "zustand";

interface HeaderState {
  collectionName: string;
  productCount: number;
  setCollectionName: (name: string) => void;
  setProductCount: (count: number) => void;
  reset: () => void;
}

export const useHeaderStore = create<HeaderState>((set: (partial: Partial<HeaderState>) => void) => ({
  collectionName: "",
  productCount: 0,
  setCollectionName: (name: string) => set({ collectionName: name }),
  setProductCount: (count: number) => set({ productCount: count }),
  reset: () => set({ collectionName: "", productCount: 0 }),
}));

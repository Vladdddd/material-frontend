import { create } from "zustand";

export type Type = {
  assets: string[];
  name: string;
  __v: number;
  _id: string;
};

export interface ITypeStore {
  types: Type[];
  fetch: any;
}

export const useTypeStore = create<ITypeStore>((set) => ({
  types: [],
  fetch: async () => {
    const response = await fetch("http://localhost:4444/types", {
      method: "GET",
    });
    set({ types: await response.json() });
  },
}));

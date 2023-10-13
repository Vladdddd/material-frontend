import { create } from "zustand";

export type AssetType = {
  _id?: string;
  name: string;
  id: string;
  commissioningDate: Date;
  cost: number;
  writeOffDate: Date;
  releaseDate: Date;
  serviceTerm: number,
  typeId?: string; 
  type?: string;
};

export interface IAssetStore {
  assets: Array<AssetType>;
  fetchAsset: () => void;
  getAssetsByName: (query: string) => void;
  getAssetsByDate: (startDate: Date, endDate: Date) => void;
  getAssetsById: (id: string) => void;
  createAsset: (data: any, typeId: string) => void;
  updateAsset: (data: any, id: string) => void;
  deleteAsset: (id: string) => void;
}

export const useAssetStore = create<IAssetStore>((set) => ({
  assets: [],
  loading: false,
  error: null,
  fetchAsset: async () => {
    const response: any = await fetch(
      `http://localhost:4444/assets/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    set({
      assets: await response.json(),
    });
  },
  getAssetsByDate: async (startDate: Date, endDate: Date) => {
    const response: any = await fetch(
      `http://localhost:4444/assets/${startDate}/${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    set({
      assets: await response.json(),
    });
  },
  getAssetsByName: async (query: string) => {
    const response: any = await fetch(
      `http://localhost:4444/assetsByName/${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    set({
      assets: await response.json(),
    });
  },
  getAssetsById: async (query: string) => {
    const response: any = await fetch(
      `http://localhost:4444/assetsById/${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    set({
      assets: await response.json(),
    });
  },
  createAsset: async (data: AssetType, typeId: string) => {
    const response: any = await fetch("http://localhost:4444/assets/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        name: data.name, 
        commissioningDate: new Date(data.commissioningDate),
        cost: data.cost,
        writeOffDate: new Date(data.writeOffDate),
        releaseDate: new Date(data.releaseDate),
        serviceTerm: data.serviceTerm,
        id: data.id,
        typeId 
      }),
    });
    set({
      assets: await response.json(),
    });
  },
  updateAsset: async (data: AssetType, id: string) => {
    const response: any = await fetch(
      `http://localhost:4444/assets/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id: data.id,
          name: data.name, 
          commissioningDate: data.commissioningDate,
          cost: data.cost,
          writeOffDate: data.writeOffDate,
          releaseDate: data.releaseDate,
          serviceTerm: data.serviceTerm,
          typeId: data.type
        }),
      },
    );
    set({
      assets: await response.json(),
    });
  },
  deleteAsset: async (id: string) => {
    const response: any = await fetch(
      `http://localhost:4444/assets/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    set({
      assets: await response.json(),
    });
  },
}));

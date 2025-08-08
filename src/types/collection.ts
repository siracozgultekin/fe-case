export type Filter = {
  id: string;
  title: string;
  value: string;
  valueName: string;
  currency?: string | null;
  comparisonType: number;
};

export type Product = {
  productCode: string;
  colorCode?: string | null;
  name: string | null;
  imageUrl: string;
  outOfStock?: boolean;
  isSaleB2B?: boolean;
};

export type CollectionInfo = {
  id: number;
  name: string;
  description: string;
  url: string;
  langCode: string;
};

export type CollectionFilters = {
  useOrLogic: boolean;
  filters: Filter[] | null;
};

export type Collection = {
  id: number;
  type: number;
  info: CollectionInfo;
  filters: CollectionFilters;
  salesChannelId: number;
  products?: Product[] | null;
};

export type ComparisonType = {
  [key: number]: string;
};

export const COMPARISON_TYPES: ComparisonType = {
  1: "Eşit",
  2: "Eşit Değil", 
  3: "Büyük",
  4: "Küçük",
  5: "Büyük Eşit",
  6: "Küçük Eşit",
  7: "İçerir",
  8: "İçermez"
};
export type GetProductsFilter = {
  id: string;
  value: string;
  comparisonType: number;
};

export type GetProductsRequest = {
  additionalFilters: GetProductsFilter[];
  page: number;
  pageSize: number;
};

export type GetProductsMeta = {
  page: number;
  pageSize: number;
  totalProduct: number;
};

export type GetProductsResponse = {
  status: number;
  message: string;
  data: {
    meta: GetProductsMeta;
    data: Product[];
  };
};

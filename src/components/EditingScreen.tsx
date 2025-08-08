"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Save, Cancel, Close } from "@mui/icons-material";
import ProductTable from "./ProductTable";
import ConstantTable from "./ConstantTable";
import {
  Collection,
  Product,
  GetProductsFilter,
  GetProductsRequest,
  GetProductsResponse,
} from "@/types/collection";
import { useSession } from "next-auth/react";
import { useHeaderStore } from "@/store/headerStore";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
interface EditingScreenProps {
  collection: Collection;
}

interface FilterState {
  searchTerm: string;
  colorCode: string;
  sortBy: string;
}

export default function EditingScreen({ collection }: EditingScreenProps) {
  const { data: session, status } = useSession();
  const { setCollectionName } = useHeaderStore();
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    colorCode: "",
    sortBy: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [modifiedProducts, setModifiedProducts] = useState<Product[]>([]);
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const page = 1;
  const pageSize = 18;

  const fetchProducts = async (additionalFilters: GetProductsFilter[] = []) => {
    if (status === "loading") return;
    if (
      status === "unauthenticated" ||
      !session ||
      !(session as unknown as { accessToken: string }).accessToken
    ) {
      setError("Oturum açmanız gerekiyor");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestBody: GetProductsRequest = {
        additionalFilters,
        page,
        pageSize,
      };

      const response = await fetch(
        `https://maestro-api-dev.secil.biz/Collection/${collection.id}/GetProductsForConstants`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              (session as unknown as { accessToken: string }).accessToken
            }`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json: GetProductsResponse = await response.json();

      if (json.status !== 200) {
        throw new Error(json.message || "API error");
      }

      const fetchedProducts = json.data.data;
      setProducts(fetchedProducts);
      setModifiedProducts(fetchedProducts);
      setOriginalProducts(fetchedProducts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu"
      );
      setProducts([]);
      setModifiedProducts([]);
      setOriginalProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (collection?.info?.name) {
      setCollectionName(collection.info.name);
    }
  }, [page, pageSize, session, status, collection.id]);

  const uniqueColorCodes = useMemo(() => {
    const colorCodes = products
      .map((product) => product.colorCode)
      .filter((code): code is string => code !== null && code !== undefined);
    return Array.from(new Set(colorCodes));
  }, [products]);

  useEffect(() => {
    const additionalFilters: GetProductsFilter[] = [];

    if (filters.colorCode) {
      additionalFilters.push({
        id: "color",
        value: filters.colorCode,
        comparisonType: 0,
      });
    }

    fetchProducts(additionalFilters);
  }, [filters.colorCode]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (filters.searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          product.productCode
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.sortBy === "name") {
      filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (filters.sortBy === "code") {
      filtered.sort((a, b) => a.productCode.localeCompare(b.productCode));
    }

    return filtered;
  }, [products, filters.searchTerm, filters.sortBy]);

  useEffect(() => {
    setModifiedProducts(filteredProducts);
  }, [filteredProducts]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      colorCode: "",
      sortBy: "",
    });
  };

  const handleProductOrderChange = (products: Product[]) => {
    setModifiedProducts(products);
  };

  const handleSave = () => {
    setSaveModalOpen(false);
  };

  const handleCancel = () => {
    setModifiedProducts([...originalProducts]);
  };

  const hasActiveFilters =
    filters.searchTerm || filters.colorCode || filters.sortBy;

  return (
    <div className="flex flex-col w-full h-max gap-6">
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
          Hata: {error}
        </div>
      )}

      {/* Loading Display */}
      {loading && (
        <div className="p-4 bg-blue-100 text-blue-700 border border-blue-300 rounded-lg">
          Ürünler yükleniyor...
        </div>
      )}

      {/* Filtreleme Alanı */}
      <div className="flex justify-between p-6 bg-white rounded-lg shadow-md ">
        {/* Seçili Filtreler */}
        {!hasActiveFilters && <div></div>}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filters.searchTerm && (
              <span className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                Arama: {filters.searchTerm}
                <button
                  onClick={() => handleFilterChange("searchTerm", "")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.colorCode && (
              <span className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                Renk: {filters.colorCode}
                <button
                  onClick={() => handleFilterChange("colorCode", "")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.sortBy && (
              <span className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                Sıralama:{" "}
                {filters.sortBy === "name"
                  ? "İsme Göre"
                  : filters.sortBy === "code"
                  ? "Ürün Koduna Göre"
                  : filters.sortBy}
                <button
                  onClick={() => handleFilterChange("sortBy", "")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="flex items-center  px-3 py-1 text-sm text-purple-600 border border-purple-200 rounded-full hover:bg-purple-50 transition-colors"
            >
              Tümünü Temizle
            </button>
          </div>
        )}
        <button
          onClick={() => setFilterDrawerOpen(true)}
          className={`flex p-2  rounded border   ${
            hasActiveFilters
              ? "border-blue-500 text-blue-600 bg-blue-50"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          } transition-colors`}
        >
          Filtrele
          <FilterAltOutlinedIcon className="w-5 h-5 mr-2" />
        </button>
      </div>

      <div className="flex gap-6 h-full ">
        <div className="flex-1 border min-h-full  rounded-lg">
          <ProductTable
            collection={{
              ...collection,
              products: modifiedProducts,
            }}
            filters={filters}
            onProductOrderChange={handleProductOrderChange}
          />
        </div>
        <div className="flex-1 border min-h-full rounded-lg">
          <ConstantTable />
        </div>
      </div>

      {/* Kaydetme Alanı */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Kaydetme Alanı</h2>
          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              disabled={
                JSON.stringify(modifiedProducts) ===
                JSON.stringify(originalProducts)
              }
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Cancel className="w-4 h-4" />
              Vazgeç
            </button>
            <button
              onClick={() => setSaveModalOpen(true)}
              disabled={
                JSON.stringify(modifiedProducts) ===
                JSON.stringify(originalProducts)
              }
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Ürün Sıralamasını Kaydet
            </button>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {/* Save Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Değişiklikleri Kaydet
            </h3>
            <p className="text-gray-600 mb-4">
              Ürün sıralamasında yaptığınız değişiklikler kaydedilecek. Devam
              etmek istediğinizden emin misiniz?
            </p>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Güncel Ürün Sırası:
              </h4>
              <div className="flex flex-wrap gap-2">
                {modifiedProducts.map((product, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 rounded text-gray-700"
                  >
                    {index + 1}. {product.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSaveModalOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                <Cancel className="w-4 h-4" />
                İptal
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Drawer */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 w-full bg-black/10 backdrop-blur-sm flex items-end justify-center z-50">
          <div className="bg-white rounded-t-lg p-6 w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Filtreler</h3>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Close className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ürün ara
                </label>
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange("searchTerm", e.target.value)
                  }
                  placeholder="Ürün adı veya kodu ile ara..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renk Kodu
                </label>
                <select
                  value={filters.colorCode}
                  onChange={(e) =>
                    handleFilterChange("colorCode", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tümü</option>
                  {uniqueColorCodes.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sırala
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Varsayılan</option>
                  <option value="name">İsme Göre (A-Z)</option>
                  <option value="code">Ürün Koduna Göre</option>
                </select>
              </div>

              <hr className="my-4" />

              <div className="flex gap-3">
                <button
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Filtreleri Temizle
                </button>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Uygula
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

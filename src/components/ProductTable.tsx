"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useHeaderStore } from "@/store/headerStore";
import type { Collection, Product } from "@/types/collection";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type FilterState = {
  searchTerm: string;
  colorCode: string;
  sortBy: string;
};

type ProductTableProps = {
  collection: Collection;
  filters?: FilterState;
  onProductOrderChange?: (products: Product[]) => void;
};

type SortableProductCardProps = {
  product: Product;
  index: number;
};

function SortableProductCard({ product, index }: SortableProductCardProps) {
  const {
    attributes,
    // ...existing code...
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `product-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`h-full flex flex-col rounded-lg shadow-md transition-transform duration-200 relative cursor-grab ${
        isDragging
          ? "cursor-grabbing"
          : "hover:-translate-y-0.5 hover:shadow-lg"
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="h-[160px] w-full bg-gray-100 rounded-t-lg flex items-center justify-center overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name || "Product"}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="flex-grow p-4 overflow-hidden">
        <h3 className="text-sm font-semibold leading-tight mb-2">
          {product.name}
        </h3>

        <p className="text-xs text-gray-600 mb-2">{product.productCode}</p>
      </div>
    </div>
  );
}

export default function ProductTable({
  collection,
  filters = { searchTerm: "", colorCode: "", sortBy: "" },
  onProductOrderChange,
}: ProductTableProps) {
  const { setProductCount } = useHeaderStore();
  const [sortedProducts, setSortedProducts] = useState(
    collection.products || []
  );

  const products = collection.products || [];

  useEffect(() => {
    setSortedProducts(collection.products || []);
  }, [collection.products]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSortedProducts((items: Product[]) => {
        const oldIndex = items.findIndex(
          (_: Product, index: number) => `product-${index}` === active.id
        );
        const newIndex = items.findIndex(
          (_: Product, index: number) => `product-${index}` === over?.id
        );

        const newOrder = arrayMove(items, oldIndex, newIndex);

        setTimeout(() => {
          onProductOrderChange?.(newOrder);
        }, 0);

        return newOrder;
      });
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...sortedProducts];

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

    if (filters.colorCode) {
      filtered = filtered.filter(
        (product) => product.colorCode === filters.colorCode
      );
    }

    if (filters.sortBy === "name") {
      filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (filters.sortBy === "code") {
      filtered.sort((a, b) => a.productCode.localeCompare(b.productCode));
    }

    return filtered;
  }, [sortedProducts, filters]);

  useEffect(() => {
    setProductCount(filteredProducts.length);
  }, [filteredProducts, setProductCount]);

  if (filteredProducts.length === 0 && products.length > 0) {
    return (
      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Ürünler ({products.length})</h2>
        </div>

        <div className="h-75 flex items-center justify-center">
          <p className="text-sm text-gray-500">
            Filtre kriterlerine uygun ürün bulunamadı
          </p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="h-75 flex items-center justify-center">
        <p className="text-sm text-gray-500">Bu koleksiyonda ürün bulunmuyor</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Products Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredProducts.map((_, index) => `product-${index}`)}
          strategy={rectSortingStrategy}
        >
          <div className="md:max-h-[576px] md:overflow-y-auto">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 m-6 gap-6"
              style={{ gridAutoRows: "280px" }}
            >
              {filteredProducts.map((product, index) => (
                <SortableProductCard
                  key={`product-${index}`}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

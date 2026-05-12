"use client";

import React from "react";
import { Package, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessProductsSection } from "../components/BusinessProductsSection";
import { BusinessProductModal } from "../components/BusinessProductModal";
import type { Product, Category } from "../types";

interface ProductsViewProps {
  products: Product[];
  categories: Category[];
  images: string[];
  brandContent: any;
  searchTerm: string;
  selectedCategory: string;
  selectedProducts: string[];
  mounted: boolean;
  productCurrentPage: number;
  productItemsPerPage: number;
  showProductDialog: boolean;
  editingProduct: Product | null;
  productFormData: any;
  savingProduct: boolean;
  newInfoKey: string;
  newInfoValue: string;
  onSearchTermChange: (term: string) => void;
  onSelectedCategoryChange: (category: string) => void;
  onSelectedProductsChange: (products: string[]) => void;
  onProductCurrentPageChange: (page: number) => void;
  onProductItemsPerPageChange: (limit: number) => void;
  onOpenProductDialog: () => void;
  onCloseProductDialog: () => void;
  onProductEdit: (product: Product) => void;
  onProductDelete: (product: Product) => void;
  onProductSave: () => Promise<void>;
  onProductFormDataChange: (data: any) => void;
  onNewInfoKeyChange: (value: string) => void;
  onNewInfoValueChange: (value: string) => void;
  onAddInfo: () => void;
  onRemoveInfo: (key: string) => void;
  onShare: (product: Product) => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  onBulkDelete: () => void;
}

export default function ProductsView({
  products,
  categories,
  images,
  brandContent,
  searchTerm,
  selectedCategory,
  selectedProducts,
  mounted,
  productCurrentPage,
  productItemsPerPage,
  showProductDialog,
  editingProduct,
  productFormData,
  savingProduct,
  newInfoKey,
  newInfoValue,
  onSearchTermChange,
  onSelectedCategoryChange,
  onSelectedProductsChange,
  onProductCurrentPageChange,
  onProductItemsPerPageChange,
  onOpenProductDialog,
  onCloseProductDialog,
  onProductEdit,
  onProductDelete,
  onProductSave,
  onProductFormDataChange,
  onNewInfoKeyChange,
  onNewInfoValueChange,
  onAddInfo,
  onRemoveInfo,
  onShare,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete,
}: ProductsViewProps) {
  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
          Products Management
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Manage your product catalog and inventory.
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </div>
        <Button onClick={onOpenProductDialog} className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Section */}
      <BusinessProductsSection
        products={products}
        categories={categories}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedProducts={selectedProducts}
        mounted={mounted}
        productCurrentPage={productCurrentPage}
        productItemsPerPage={productItemsPerPage}
        onSelectedCategoryChange={onSelectedCategoryChange}
        onSelectedProductsChange={onSelectedProductsChange}
        onProductCurrentPageChange={onProductCurrentPageChange}
        onProductItemsPerPageChange={onProductItemsPerPageChange}
        onOpenBulkActivate={onBulkActivate}
        onOpenBulkDeactivate={onBulkDeactivate}
        onOpenBulkDelete={onBulkDelete}
        onAddProduct={onOpenProductDialog}
        onEditProduct={onProductEdit}
        onShareProduct={onShare}
        onDeleteProduct={onProductDelete}
      />

      {/* Product Modal */}
      {showProductDialog && (
        <BusinessProductModal
          isOpen={showProductDialog}
          onClose={onCloseProductDialog}
          editingProduct={editingProduct}
          productFormData={productFormData}
          setProductFormData={onProductFormDataChange}
          categories={categories}
          brandContent={brandContent}
          images={images}
          mounted={mounted}
          savingProduct={savingProduct}
          newInfoKey={newInfoKey}
          newInfoValue={newInfoValue}
          onNewInfoKeyChange={onNewInfoKeyChange}
          onNewInfoValueChange={onNewInfoValueChange}
          onAddInfo={onAddInfo}
          onRemoveInfo={onRemoveInfo}
          onSave={onProductSave}
        />
      )}
    </div>
  );
}

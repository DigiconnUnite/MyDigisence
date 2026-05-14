"use client";

import React from "react";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BusinessProductsSection } from "../components/BusinessProductsSection";
import { BusinessProductModal } from "../components/BusinessProductModal";
import type { Product, Category } from "../types";
import AdminSectionHeader from "../../admin/components/AdminSectionHeader";
import AdminViewControls from "../../admin/components/AdminViewControls";

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
      <AdminSectionHeader
        title="Products Management"
        description="Manage your product catalog and inventory."
      />

      <AdminViewControls
        actions={
          <Button onClick={onOpenProductDialog} className="rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        }
        searchValue={searchTerm}
        onSearchChange={onSearchTermChange}
        searchPlaceholder="Search products..."
      />

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

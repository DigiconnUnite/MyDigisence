import { CheckCircle, Edit, Image as ImageIcon, Package, Pause, Plus, Share2, Trash2, X } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Category, Product } from "../types";

interface BusinessProductsSectionProps {
  products: Product[];
  categories: Category[];
  searchTerm: string;
  selectedCategory: string;
  selectedProducts: string[];
  mounted: boolean;
  productCurrentPage: number;
  productItemsPerPage: number;
  onSelectedCategoryChange: (value: string) => void;
  onSelectedProductsChange: (ids: string[]) => void;
  onProductCurrentPageChange: (page: number) => void;
  onProductItemsPerPageChange: (limit: number) => void;
  onOpenBulkActivate: () => void;
  onOpenBulkDeactivate: () => void;
  onOpenBulkDelete: () => void;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onShareProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

export function BusinessProductsSection({
  products,
  categories,
  searchTerm,
  selectedCategory,
  selectedProducts,
  mounted,
  productCurrentPage,
  productItemsPerPage,
  onSelectedCategoryChange,
  onSelectedProductsChange,
  onProductCurrentPageChange,
  onProductItemsPerPageChange,
  onOpenBulkActivate,
  onOpenBulkDeactivate,
  onOpenBulkDelete,
  onAddProduct,
  onEditProduct,
  onShareProduct,
  onDeleteProduct,
}: BusinessProductsSectionProps) {
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || product.categoryId === selectedCategory),
  );

  const startIndex = (productCurrentPage - 1) * productItemsPerPage;
  const endIndex = startIndex + productItemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className=" mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Products & Services</h1>
          <p className="text-md text-gray-600">Manage your product offerings</p>
        </div>
        <Button
          variant="default"
          onClick={onAddProduct}
          className="rounded-xl  hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="mb-6 flex justify-end">
        <Select
          value={selectedCategory}
          onValueChange={(value) => {
            onSelectedCategoryChange(value === "all" ? "" : value);
            onProductCurrentPageChange(1);
          }}
        >
          <SelectTrigger className="w-full bg-white sm:w-48 rounded-2xl">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="p-0 bg-white rounded-xl overflow-hidden">
        <CardContent className="p-0">
          {mounted && selectedProducts.length > 0 && (
            <div className="p-4 bg-blue-50 border-b border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-blue-900">
                  {selectedProducts.length} product
                  {selectedProducts.length > 1 ? "s" : ""} selected
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onOpenBulkActivate}
                  className="rounded-xl"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onOpenBulkDeactivate}
                  className="rounded-xl"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Deactivate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onOpenBulkDelete}
                  className="rounded-xl"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onSelectedProductsChange([])}
                className="rounded-xl"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="overflow-x-auto border border-gray-200 rounded-md ">
            <Table>
              <TableHeader className="bg-[#080322] ">
                <TableRow>
                  <TableHead className="w-12 text-white font-medium">
                    <Checkbox
                      checked={
                        selectedProducts.length === filteredProducts.length &&
                        selectedProducts.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onSelectedProductsChange(filteredProducts.map((p) => p.id));
                        } else {
                          onSelectedProductsChange([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="text-white font-medium">Image</TableHead>
                  <TableHead className="text-white font-medium">Name</TableHead>
                  <TableHead className="text-white font-medium">Category</TableHead>
                  <TableHead className="text-white font-medium">Brand</TableHead>
                  <TableHead className="text-white font-medium">Price</TableHead>
                  <TableHead className="text-white font-medium">Status</TableHead>
                  <TableHead className="w-32 text-white font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onSelectedProductsChange([...selectedProducts, product.id]);
                          } else {
                            onSelectedProductsChange(
                              selectedProducts.filter((id) => id !== product.id),
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {product.image ? (
                        <img
                          src={getOptimizedImageUrl(product.image, {
                            width: 50,
                            height: 50,
                            quality: 85,
                            format: "auto",
                          })}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-2xl"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      {product.category ? (
                        <Badge variant="secondary" className="rounded-full">
                          {product.category.name}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.brandName ? (
                        <Badge variant="outline" className="rounded-full">
                          {product.brandName}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>{product.price || "—"}</TableCell>
                    <TableCell>
                      <div
                        className={`flex items-center gap-1.5 px-1.5 w-fit py-0.5 rounded-full border text-xs font-medium ${
                          product.inStock
                            ? "bg-lime-500/10 border-lime-500/30 text-lime-700"
                            : "bg-red-500/10 border-red-500/30 text-red-600"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            product.inStock ? "bg-lime-500" : "bg-red-500"
                          }`}
                        ></span>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditProduct(product)}
                          className="rounded-xl"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onShareProduct(product)}
                          className="rounded-xl"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDeleteProduct(product)}
                          className="rounded-xl"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-4">Add your first product or service to get started</p>
              <Button
                onClick={onAddProduct}
                className="rounded-xl bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          )}

          {products.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination
                currentPage={productCurrentPage}
                totalPages={Math.ceil(filteredProducts.length / productItemsPerPage)}
                totalItems={filteredProducts.length}
                itemsPerPage={productItemsPerPage}
                onPageChange={onProductCurrentPageChange}
                onItemsPerPageChange={(limit) => {
                  onProductItemsPerPageChange(limit);
                  onProductCurrentPageChange(1);
                }}
                className="flex-wrap"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

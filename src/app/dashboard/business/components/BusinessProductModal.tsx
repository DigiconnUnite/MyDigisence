import { type Dispatch, type SetStateAction } from "react";
import {
  DollarSign,
  FileText,
  Image as ImageIcon,
  Package,
  Plus,
  Save,
  Trash2,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UnifiedModal } from "@/components/ui/UnifiedModal";
import ImageUpload from "@/components/ui/image-upload";
import type { BrandContent, Category, Product, ProductFormData } from "../types";

interface BusinessProductModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  productFormData: ProductFormData;
  setProductFormData: Dispatch<SetStateAction<ProductFormData>>;
  categories: Category[];
  brandContent: BrandContent;
  images: string[];
  mounted: boolean;
  savingProduct: boolean;
  newInfoKey: string;
  newInfoValue: string;
  onNewInfoKeyChange: (value: string) => void;
  onNewInfoValueChange: (value: string) => void;
  onAddInfo: () => void;
  onRemoveInfo: (key: string) => void;
  onClose: () => void;
  onSave: () => Promise<void>;
}

export function BusinessProductModal({
  isOpen,
  editingProduct,
  productFormData,
  setProductFormData,
  categories,
  brandContent,
  images,
  mounted,
  savingProduct,
  newInfoKey,
  newInfoValue,
  onNewInfoKeyChange,
  onNewInfoValueChange,
  onAddInfo,
  onRemoveInfo,
  onClose,
  onSave,
}: BusinessProductModalProps) {
  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={(open) => {
        if (!open) {
          onClose();
        }
      }}
      title={editingProduct ? "Edit Product" : "Add New Product"}
      description={
        editingProduct
          ? "Update product details"
          : "Create a new product or service"
      }
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={savingProduct}
            className="rounded-xl"
          >
            {savingProduct ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {editingProduct ? "Update Product" : "Add Product"}
              </>
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <div className="relative">
            <Input
              id="name"
              value={productFormData.name}
              onChange={(e) =>
                setProductFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Enter product name"
              required
              className="pl-10 rounded-md"
            />
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={productFormData.description}
            onChange={(e) =>
              setProductFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Describe your product or service"
            rows={4}
            className="rounded-md"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2 space-y-2">
            <Label htmlFor="price">Price</Label>
            <div className="relative">
              <Input
                id="price"
                value={productFormData.price}
                onChange={(e) =>
                  setProductFormData((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
                placeholder="e.g., ₹50, Starting at ₹100, Free consultation"
                className="pl-10 rounded-md"
              />
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <div className="relative">
              <Input
                id="image"
                value={productFormData.image}
                onChange={(e) =>
                  setProductFormData((prev) => ({
                    ...prev,
                    image: e.target.value,
                  }))
                }
                placeholder="https://..."
                className="pl-10 rounded-md"
              />
              <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Select Existing Image</Label>
          <Select
            key={images.length}
            value={productFormData.image || "no-image"}
            onValueChange={(value) =>
              setProductFormData((prev) => ({
                ...prev,
                image: value === "no-image" ? "" : value,
              }))
            }
          >
            <SelectTrigger className="rounded-md w-full">
              <SelectValue placeholder="Choose an existing image" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-image">No image</SelectItem>
              {images.map((image) => {
                const MAX_URL_LENGTH = 32;
                const displayUrl =
                  image.length > MAX_URL_LENGTH
                    ? image.slice(0, MAX_URL_LENGTH) + "..."
                    : image;
                return (
                  <SelectItem
                    className=" flex items-center gap-2"
                    key={image}
                    value={image}
                  >
                    <img
                      src={image}
                      alt={displayUrl}
                      className="inline-block h-8 w-8  rounded-full object-cover border pr-2"
                      style={{ minWidth: "2rem" }}
                    />
                    <span
                      className="truncate border-l px-2 border-l-gray-300 "
                      title={image}
                    >
                      {displayUrl}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {mounted && (
            <ImageUpload
              onUpload={(url) =>
                setProductFormData((prev) => ({
                  ...prev,
                  image: url,
                }))
              }
            />
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2 space-y-2">
            <Label>Category</Label>
            <Select
              key={categories.length}
              value={productFormData.categoryId}
              onValueChange={(value) =>
                setProductFormData((prev) => ({
                  ...prev,
                  categoryId: value,
                }))
              }
            >
              <SelectTrigger className="rounded-md w-full">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/2 space-y-2">
            <Label>Brand</Label>
            <div className="relative">
              <Select
                value={productFormData.brandName}
                onValueChange={(value) =>
                  setProductFormData((prev) => ({
                    ...prev,
                    brandName: value,
                  }))
                }
              >
                <SelectTrigger className="rounded-md w-full">
                  <SelectValue placeholder="Choose a brand" />
                </SelectTrigger>
                <SelectContent>
                  <div className="max-h-48 overflow-y-auto">
                    {(brandContent.brands || []).map((brand) => (
                      <SelectItem key={brand.name} value={brand.name}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex border-t border-b py-2 items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={productFormData.inStock}
              onCheckedChange={(checked) =>
                setProductFormData((prev) => ({
                  ...prev,
                  inStock: checked,
                }))
              }
            />
            <Label htmlFor="inStock">In Stock</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={productFormData.isActive}
              onCheckedChange={(checked) =>
                setProductFormData((prev) => ({
                  ...prev,
                  isActive: checked,
                }))
              }
            />
            <Label htmlFor="isActive">Visible </Label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Information</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Input
                  placeholder="Key (e.g., Material)"
                  value={newInfoKey || ""}
                  onChange={(e) => onNewInfoKeyChange(e.target.value)}
                  className="pl-10 rounded-md"
                />
                <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Value (e.g., Cotton)"
                    value={newInfoValue || ""}
                    onChange={(e) => onNewInfoValueChange(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        onAddInfo();
                      }
                    }}
                    className="pl-10 rounded-md"
                  />
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onAddInfo}
                  disabled={!newInfoKey?.trim() || !newInfoValue?.trim()}
                  className="rounded-md"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {productFormData.additionalInfo &&
              Object.keys(productFormData.additionalInfo).length > 0 && (
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full bg-gray-50 rounded-md">
                    <tbody>
                      {Object.entries(productFormData.additionalInfo).map(
                        ([key, value], index) => (
                          <tr key={index} className="border-b last:border-b-0">
                            <td className="px-3 py-2 font-medium text-sm">
                              {key}
                            </td>
                            <td className="px-3 py-2 text-sm">{value}</td>
                            <td className="py-2 text-right pr-4">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveInfo(key)}
                                className="h-6 w-6 p-0 hover:bg-gray-200 rounded-full flex items-center justify-center ml-auto"
                                title="Remove field"
                              >
                                <span className="sr-only">Remove</span>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        </div>
      </div>
    </UnifiedModal>
  );
}
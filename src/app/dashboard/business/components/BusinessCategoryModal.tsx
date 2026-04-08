import { type Dispatch, type SetStateAction } from "react";
import { FolderTree, Type } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { UnifiedModal } from "@/components/ui/UnifiedModal";
import type { Category, CategoryFormData } from "../types";

interface BusinessCategoryModalProps {
  isOpen: boolean;
  editingCategory: Category | null;
  categoryFormData: CategoryFormData;
  setCategoryFormData: Dispatch<SetStateAction<CategoryFormData>>;
  categories: Category[];
  sectionTitle: string;
  onSectionTitleChange: (value: string) => void;
  savingCategory: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
}

export function BusinessCategoryModal({
  isOpen,
  editingCategory,
  categoryFormData,
  setCategoryFormData,
  categories,
  sectionTitle,
  onSectionTitleChange,
  savingCategory,
  onClose,
  onSave,
}: BusinessCategoryModalProps) {
  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={(open) => {
        if (!open) {
          onClose();
        }
      }}
      title={editingCategory ? "Edit Category" : "Add New Category"}
      description={
        editingCategory
          ? "Update category details"
          : "Create a new category for your products"
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={savingCategory}
            className="rounded-xl"
          >
            {savingCategory ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : editingCategory ? (
              "Update Category"
            ) : (
              "Add Category"
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium">Section Title</Label>
          <div className="relative">
            <Input
              value={sectionTitle}
              onChange={(e) => onSectionTitleChange(e.target.value)}
              placeholder="Enter section title"
              className="pl-10 rounded-md"
            />
            <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Category Name *</Label>
          <div className="relative">
            <Input
              placeholder="Enter category name"
              value={categoryFormData.name}
              onChange={(e) =>
                setCategoryFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="pl-10 rounded-md"
            />
            <FolderTree className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            placeholder="Describe this category"
            value={categoryFormData.description}
            onChange={(e) =>
              setCategoryFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={3}
            className="rounded-md"
          />
        </div>

        <div className="space-y-2">
          <Label>Parent Category</Label>
          <Select
            value={categoryFormData.parentId || "none"}
            onValueChange={(value) =>
              setCategoryFormData((prev) => ({
                ...prev,
                parentId: value === "none" ? "" : value,
              }))
            }
          >
            <SelectTrigger className="rounded-md">
              <SelectValue placeholder="Select parent category (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No parent</SelectItem>
              {categories
                .filter((cat) => !cat.parentId)
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </UnifiedModal>
  );
}
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BulkActionsToolbar } from "@/components/ui/pagination";
import { Edit, FolderTree, Plus, Trash2 } from "lucide-react";
import AdminViewControls from "./AdminViewControls";
import AdminSectionHeader from "./AdminSectionHeader";
import AdminActionIconButton from "./AdminActionIconButton";
import type { Category } from "../types";

interface CategoriesViewProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onOpenAddCategory: () => void;
  selectedCategories: Set<string>;
  setSelectedCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
  safeCategories: Category[];
  filteredCategories: Category[];
  onInfoToast: (description: string) => void;
  handleEditCategory: (category: Category) => void;
  handleDeleteCategory: (category: Category) => void;
}

export default function CategoriesView({
  searchTerm,
  setSearchTerm,
  onOpenAddCategory,
  selectedCategories,
  setSelectedCategories,
  safeCategories,
  filteredCategories,
  onInfoToast,
  handleEditCategory,
  handleDeleteCategory,
}: CategoriesViewProps) {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <AdminSectionHeader
        title="Manage Categories"
        description="Add, view, edit, and manage all business categories"
      />

      <AdminViewControls
        actions={
          <Button
            onClick={onOpenAddCategory}
            className="rounded-xl bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Category</span>
            <span className="sm:hidden">Add</span>
          </Button>
        }
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search categories..."
      />

      {selectedCategories.size > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <BulkActionsToolbar
            selectedCount={selectedCategories.size}
            totalCount={safeCategories.length}
            onSelectAll={() => {
              const allIds = filteredCategories.map((c) => c.id);
              setSelectedCategories(new Set(allIds));
            }}
            onDeselectAll={() => setSelectedCategories(new Set())}
            onBulkActivate={() => {
              onInfoToast("Bulk activate not applicable for categories");
            }}
            onBulkDeactivate={() => {
              onInfoToast("Bulk deactivate not applicable for categories");
            }}
            onBulkDelete={() => {
              onInfoToast(`Selected ${selectedCategories.size} categories`);
            }}
          />
        </div>
      )}

      <div className="bg-white rounded-md  overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <Table>
              <TableHeader className="bg-[#080322]">
                <TableRow>
                  <TableHead className="w-14 text-white font-medium">SN.</TableHead>
                  <TableHead className="text-white font-medium">Category Name</TableHead>
                  <TableHead className="text-white font-medium">Slug</TableHead>
                  <TableHead className="text-white font-medium">Parent Category</TableHead>
                  <TableHead className="text-center text-white font-medium">Item Count</TableHead>
                  <TableHead className="text-center text-white font-medium ">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FolderTree className="h-12 w-12 mb-3 opacity-30" />
                        <p className="text-base font-medium">No categories found</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {searchTerm ? "Try adjusting your search" : "Get started by adding your first category"}
                        </p>
                        {!searchTerm && (
                          <Button
                            onClick={onOpenAddCategory}
                            className="mt-4 bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white rounded-xl hover:opacity-90 transition-opacity"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category, index) => {
                    const parentCategory = category.parentId
                      ? safeCategories.find((c) => c.id === category.parentId)
                      : null;

                    return (
                      <TableRow
                        key={category.id}
                        className={`hover:bg-gray-50 ${category.parentId ? "bg-gray-50/50" : ""}`}
                      >
                        <TableCell className="text-gray-500 font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={category.parentId ? "text-sm" : "font-medium"}>{category.name}</span>
                            {category.parentId && (
                              <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                                Sub
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{category.slug}</code>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {parentCategory ? (
                            <span className="text-sm">{parentCategory.name}</span>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="rounded-full">
                            {category._count?.businesses || 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-1">
                            <AdminActionIconButton
                              onClick={() => handleEditCategory(category)}
                              title="Edit Category"
                              rounded="md"
                            >
                              <Edit className="h-4 w-4 text-gray-500" />
                            </AdminActionIconButton>
                            <AdminActionIconButton
                              onClick={() => handleDeleteCategory(category)}
                              title="Delete Category"
                              tone="danger"
                              rounded="md"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </AdminActionIconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Table>
        </div>
      </div>
    </div>
  );
}

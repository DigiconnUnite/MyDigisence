import { useCallback } from "react";
import { invalidateCategories } from "@/lib/cacheInvalidation";
import { requestAdminMutation } from "./adminMutation";
import type { Category } from "../types";

interface UseCategoryActionsOptions {
  editingCategory: Category | null;
  setEditingCategory: React.Dispatch<React.SetStateAction<Category | null>>;
  categoryToDelete: Category | null;
  setCategoryToDelete: React.Dispatch<React.SetStateAction<Category | null>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setShowDeleteCategoryDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRightPanel: React.Dispatch<React.SetStateAction<boolean>>;
  setRightPanelContent: React.Dispatch<React.SetStateAction<"add-business" | "edit-business" | "add-professional" | "edit-professional" | "add-category" | "edit-category" | "create-account-from-inquiry" | null>>;
  fetchData: () => Promise<void>;
  queryClient: any;
  toast: (args: { title: string; description: string; variant?: "destructive" }) => void;
}

export function useCategoryActions({
  editingCategory,
  setEditingCategory,
  categoryToDelete,
  setCategoryToDelete,
  setCategories,
  setShowDeleteCategoryDialog,
  setShowRightPanel,
  setRightPanelContent,
  fetchData,
  queryClient,
  toast,
}: UseCategoryActionsOptions) {
  const handleAddCategory = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      const rawParentId = formData.get("parentId") as string;
      const categoryData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        parentId: rawParentId === "none" ? null : rawParentId || undefined,
      };

      const result = await requestAdminMutation<{ category?: Category }>(
        "/api/admin/categories",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        },
        "Failed to create category"
      );

      if (result.ok) {
        const createdCategory = result.data?.category;
        if (createdCategory) {
          const safeCreatedCategory: Category = createdCategory;
          setCategories((prev) => [...prev, safeCreatedCategory]);
        }

        invalidateCategories(queryClient);
        await fetchData();

        toast({ title: "Success", description: "Category created successfully!" });
        setShowRightPanel(false);
        setRightPanelContent(null);
        e.currentTarget.reset();
      } else {
        toast({
          title: "Error",
          description: `Failed to create category: ${result.error || "Unknown error"}`,
          variant: "destructive",
        });
      }
    },
    [fetchData, queryClient, setCategories, setRightPanelContent, setShowRightPanel, toast]
  );

  const handleEditCategory = useCallback(
    (category: Category) => {
      setEditingCategory(category);
      setRightPanelContent("edit-category");
      setShowRightPanel(true);
    },
    [setEditingCategory, setRightPanelContent, setShowRightPanel]
  );

  const handleUpdateCategory = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!editingCategory) return;

      const formData = new FormData(e.currentTarget);
      const rawParentId = formData.get("parentId") as string;
      const updateData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        parentId: rawParentId === "none" ? null : rawParentId || null,
      };

      const result = await requestAdminMutation<{ category?: Category }>(
        `/api/admin/categories/${editingCategory.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        },
        "Failed to update category"
      );

      if (result.ok) {
        const updatedCategory = result.data?.category;
        if (updatedCategory) {
          const safeUpdatedCategory: Category = updatedCategory;
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? safeUpdatedCategory : c))
          );
        }

        invalidateCategories(queryClient);
        await fetchData();

        setShowRightPanel(false);
        setRightPanelContent(null);
        toast({ title: "Success", description: "Category updated successfully!" });
      } else {
        toast({
          title: "Error",
          description: `Failed to update category: ${result.error || "Unknown error"}`,
          variant: "destructive",
        });
      }
    },
    [editingCategory, fetchData, queryClient, setCategories, setRightPanelContent, setShowRightPanel, toast]
  );

  const handleDeleteCategory = useCallback(
    (category: Category) => {
      setCategoryToDelete(category);
      setShowDeleteCategoryDialog(true);
    },
    [setCategoryToDelete, setShowDeleteCategoryDialog]
  );

  const confirmDeleteCategory = useCallback(async () => {
    if (!categoryToDelete) return;

    const result = await requestAdminMutation(
      `/api/admin/categories/${categoryToDelete.id}`,
      {
        method: "DELETE",
      },
      "Failed to delete category"
    );

    if (result.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      setShowDeleteCategoryDialog(false);
      setCategoryToDelete(null);

      invalidateCategories(queryClient);
      await fetchData();

      toast({ title: "Success", description: "Category deleted successfully" });
    } else {
      toast({
        title: "Error",
        description: `Failed to delete category: ${result.error || "Unknown error"}`,
        variant: "destructive",
      });
    }
  }, [categoryToDelete, fetchData, queryClient, setCategories, setCategoryToDelete, setShowDeleteCategoryDialog, toast]);

  return {
    handleAddCategory,
    handleEditCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    confirmDeleteCategory,
  };
}

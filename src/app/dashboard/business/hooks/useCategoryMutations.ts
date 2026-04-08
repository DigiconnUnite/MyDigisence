import { useCallback } from "react";
import { requestBusinessMutation } from "./businessMutation";
import type {
  Category,
  CategoryFormData,
  MutationSuccessResponse,
} from "../types";

export const useCategoryMutations = () => {
  const saveCategory = useCallback(
    async (categoryFormData: CategoryFormData, editingCategoryId?: string) => {
      const url = editingCategoryId
        ? `/api/business/categories?id=${editingCategoryId}`
        : "/api/business/categories";

      return requestBusinessMutation<MutationSuccessResponse<Category>>(
        url,
        {
          method: editingCategoryId ? "PUT" : "POST",
          body: JSON.stringify(categoryFormData),
        },
        `Failed to ${editingCategoryId ? "update" : "create"} category`,
      );
    },
    [],
  );

  const deleteCategory = useCallback(async (categoryId: string) => {
    return requestBusinessMutation<MutationSuccessResponse<unknown>>(
      `/api/business/categories?id=${categoryId}`,
      {
        method: "DELETE",
      },
      "Failed to delete category",
    );
  }, []);

  return {
    saveCategory,
    deleteCategory,
  };
};

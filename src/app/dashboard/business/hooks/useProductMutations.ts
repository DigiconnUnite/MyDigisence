import { useCallback } from "react";
import { requestBusinessMutation } from "./businessMutation";
import type {
  MutationSuccessResponse,
  Product,
  ProductFormData,
} from "../types";

export const useProductMutations = () => {
  const saveProduct = useCallback(
    async (productFormData: ProductFormData, editingProductId?: string) => {
      const url = editingProductId
        ? `/api/business/products/${editingProductId}`
        : "/api/business/products";

      return requestBusinessMutation<MutationSuccessResponse<Product>>(
        url,
        {
          method: editingProductId ? "PUT" : "POST",
          body: JSON.stringify(productFormData),
        },
        `Failed to ${editingProductId ? "update" : "add"} product`,
      );
    },
    [],
  );

  const deleteProduct = useCallback(async (productId: string) => {
    return requestBusinessMutation<MutationSuccessResponse<unknown>>(
      `/api/business/products/${productId}`,
      {
        method: "DELETE",
      },
      "Failed to delete product",
    );
  }, []);

  const setProductActiveState = useCallback(async (productId: string, isActive: boolean) => {
    return requestBusinessMutation<MutationSuccessResponse<unknown>>(
      `/api/business/products/${productId}`,
      {
        method: "PUT",
        body: JSON.stringify({ isActive }),
      },
      `Failed to ${isActive ? "activate" : "deactivate"} product`,
    );
  }, []);

  const bulkSetProductActiveState = useCallback(
    async (productIds: string[], isActive: boolean) => {
      return Promise.all(productIds.map((id) => setProductActiveState(id, isActive)));
    },
    [setProductActiveState],
  );

  const bulkDeleteProducts = useCallback(
    async (productIds: string[]) => {
      return Promise.all(productIds.map((id) => deleteProduct(id)));
    },
    [deleteProduct],
  );

  return {
    saveProduct,
    deleteProduct,
    bulkSetProductActiveState,
    bulkDeleteProducts,
  };
};

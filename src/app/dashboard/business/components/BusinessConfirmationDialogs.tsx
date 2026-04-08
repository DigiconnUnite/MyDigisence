import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Category, Product } from "../types";

interface BusinessConfirmationDialogsProps {
  showDeleteProductDialog: boolean;
  setShowDeleteProductDialog: (open: boolean) => void;
  productToDelete: Product | null;
  onConfirmDeleteProduct: () => void;

  showDeleteCategoryDialog: boolean;
  setShowDeleteCategoryDialog: (open: boolean) => void;
  categoryToDelete: Category | null;
  onConfirmDeleteCategory: () => void;

  showDeleteBrandDialog: boolean;
  setShowDeleteBrandDialog: (open: boolean) => void;
  brandToDeleteName: string;
  onConfirmDeleteBrand: () => void;

  showDeletePortfolioDialog: boolean;
  setShowDeletePortfolioDialog: (open: boolean) => void;
  onConfirmDeletePortfolio: () => void;

  showBulkActivateDialog: boolean;
  setShowBulkActivateDialog: (open: boolean) => void;
  showBulkDeactivateDialog: boolean;
  setShowBulkDeactivateDialog: (open: boolean) => void;
  showBulkDeleteDialog: boolean;
  setShowBulkDeleteDialog: (open: boolean) => void;
  selectedProductsCount: number;
  onConfirmBulkActivate: () => void;
  onConfirmBulkDeactivate: () => void;
  onConfirmBulkDelete: () => void;
}

export function BusinessConfirmationDialogs({
  showDeleteProductDialog,
  setShowDeleteProductDialog,
  productToDelete,
  onConfirmDeleteProduct,
  showDeleteCategoryDialog,
  setShowDeleteCategoryDialog,
  categoryToDelete,
  onConfirmDeleteCategory,
  showDeleteBrandDialog,
  setShowDeleteBrandDialog,
  brandToDeleteName,
  onConfirmDeleteBrand,
  showDeletePortfolioDialog,
  setShowDeletePortfolioDialog,
  onConfirmDeletePortfolio,
  showBulkActivateDialog,
  setShowBulkActivateDialog,
  showBulkDeactivateDialog,
  setShowBulkDeactivateDialog,
  showBulkDeleteDialog,
  setShowBulkDeleteDialog,
  selectedProductsCount,
  onConfirmBulkActivate,
  onConfirmBulkDeactivate,
  onConfirmBulkDelete,
}: BusinessConfirmationDialogsProps) {
  return (
    <>
      <Dialog open={showDeleteProductDialog} onOpenChange={setShowDeleteProductDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteProductDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteCategoryDialog} onOpenChange={setShowDeleteCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{categoryToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteCategoryDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteBrandDialog} onOpenChange={setShowDeleteBrandDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Brand</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{brandToDeleteName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteBrandDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmDeleteBrand}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeletePortfolioDialog} onOpenChange={setShowDeletePortfolioDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Portfolio Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this portfolio image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeletePortfolioDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmDeletePortfolio}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBulkActivateDialog} onOpenChange={setShowBulkActivateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activate Products</DialogTitle>
            <DialogDescription>
              Are you sure you want to activate {selectedProductsCount} product{selectedProductsCount > 1 ? "s" : ""}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkActivateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={onConfirmBulkActivate}>Activate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBulkDeactivateDialog} onOpenChange={setShowBulkDeactivateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Products</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate {selectedProductsCount} product{selectedProductsCount > 1 ? "s" : ""}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDeactivateDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmBulkDeactivate}>
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Products</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedProductsCount} product{selectedProductsCount > 1 ? "s" : ""}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmBulkDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

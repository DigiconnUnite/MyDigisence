import { useCallback } from "react";
import { requestAdminMutation } from "./adminMutation";

interface InquiryActionsOptions {
  inquiries: any[];
  setInquiries: React.Dispatch<React.SetStateAction<any[]>>;
  selectedInquiries: Set<string>;
  setSelectedInquiries: React.Dispatch<React.SetStateAction<Set<string>>>;
  inquiryToDelete: any;
  setInquiryToDelete: React.Dispatch<React.SetStateAction<any>>;
  setShowDeleteInquiryDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBulkDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  toast: (args: { title: string; description: string; variant?: "destructive" }) => void;
}

export function useInquiryActions({
  inquiries,
  setInquiries,
  selectedInquiries,
  setSelectedInquiries,
  inquiryToDelete,
  setInquiryToDelete,
  setShowDeleteInquiryDialog,
  setShowBulkDeleteDialog,
  toast,
}: InquiryActionsOptions) {
  const handleViewInquiry = useCallback(
    (inquiry: any) => {
      toast({
        title: "Inquiry Details",
        description: `From: ${inquiry.name} (${inquiry.email})`,
      });
    },
    [toast]
  );

  const handleReplyInquiry = useCallback(
    (inquiry: any) => {
      toast({
        title: "Reply to Inquiry",
        description: `Opening email client for ${inquiry.email}`,
      });
    },
    [toast]
  );

  const handleDeleteInquiry = useCallback(
    (inquiry: any) => {
      setInquiryToDelete(inquiry);
      setShowDeleteInquiryDialog(true);
    },
    [setInquiryToDelete, setShowDeleteInquiryDialog]
  );

  const confirmDeleteInquiry = useCallback(() => {
    if (!inquiryToDelete) return;
    setInquiries((prev) => prev.filter((i) => i.id !== inquiryToDelete.id));
    setShowDeleteInquiryDialog(false);
    setInquiryToDelete(null);
    toast({
      title: "Inquiry Deleted",
      description: "The inquiry has been removed.",
    });
  }, [inquiryToDelete, setInquiries, setInquiryToDelete, setShowDeleteInquiryDialog, toast]);

  const handleSelectAllInquiries = useCallback(() => {
    setSelectedInquiries(new Set(inquiries.map((i) => i.id)));
  }, [inquiries, setSelectedInquiries]);

  const handleDeselectAllInquiries = useCallback(() => {
    setSelectedInquiries(new Set());
  }, [setSelectedInquiries]);

  const handleInquiryBulkActivate = useCallback(async () => {
    if (selectedInquiries.size === 0) return;
    const ids = Array.from(selectedInquiries);
    try {
      await Promise.all(
        ids.map(async (id) => {
          await requestAdminMutation(
            `/api/inquiries/${id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "REPLIED" }),
            },
            "Failed to update inquiry status"
          );
        })
      );
      setInquiries((prev) =>
        prev.map((i) => (selectedInquiries.has(i.id) ? { ...i, status: "REPLIED" } : i))
      );
      toast({
        title: "Success",
        description: `${selectedInquiries.size} inquiries marked as REPLIED`,
      });
      setSelectedInquiries(new Set());
    } catch (error) {
      toast({ title: "Error", description: "Failed to update inquiry status", variant: "destructive" });
    }
  }, [selectedInquiries, setInquiries, setSelectedInquiries, toast]);

  const handleInquiryBulkSuspend = useCallback(async () => {
    if (selectedInquiries.size === 0) return;
    const ids = Array.from(selectedInquiries);
    try {
      await Promise.all(
        ids.map(async (id) => {
          await requestAdminMutation(
            `/api/inquiries/${id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "PENDING" }),
            },
            "Failed to update inquiry status"
          );
        })
      );
      setInquiries((prev) =>
        prev.map((i) => (selectedInquiries.has(i.id) ? { ...i, status: "PENDING" } : i))
      );
      toast({
        title: "Success",
        description: `${selectedInquiries.size} inquiries marked as PENDING`,
      });
      setSelectedInquiries(new Set());
    } catch (error) {
      toast({ title: "Error", description: "Failed to update inquiry status", variant: "destructive" });
    }
  }, [selectedInquiries, setInquiries, setSelectedInquiries, toast]);

  const handleInquiryBulkDelete = useCallback(() => {
    if (selectedInquiries.size === 0) return;
    setShowBulkDeleteDialog(true);
  }, [selectedInquiries, setShowBulkDeleteDialog]);

  return {
    handleViewInquiry,
    handleReplyInquiry,
    handleDeleteInquiry,
    confirmDeleteInquiry,
    handleSelectAllInquiries,
    handleDeselectAllInquiries,
    handleInquiryBulkActivate,
    handleInquiryBulkSuspend,
    handleInquiryBulkDelete,
  };
}

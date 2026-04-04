import { useCallback } from "react";
import { requestAdminMutation } from "./adminMutation";

interface UseBusinessListingActionsOptions {
  setBusinessListingInquiries: React.Dispatch<React.SetStateAction<any[]>>;
  setShowBusinessListingInquiryDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedBusinessListingInquiry: React.Dispatch<React.SetStateAction<any>>;
  toast: (args: { title: string; description: string; variant?: "destructive" }) => void;
}

export function useBusinessListingActions({
  setBusinessListingInquiries,
  setShowBusinessListingInquiryDialog,
  setSelectedBusinessListingInquiry,
  toast,
}: UseBusinessListingActionsOptions) {
  const handleUpdateBusinessListingInquiry = useCallback(
    async (inquiryId: string, updates: any) => {
      const result = await requestAdminMutation<{ inquiry?: any }>(
        `/api/business-listing-inquiries/${inquiryId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        },
        "Failed to update inquiry"
      );

      if (result.ok) {
        setBusinessListingInquiries((prev) =>
          prev.map((inquiry) => (inquiry.id === inquiryId ? result.data?.inquiry ?? inquiry : inquiry))
        );
        toast({ title: "Success", description: "Inquiry updated successfully!" });
        setShowBusinessListingInquiryDialog(false);
        setSelectedBusinessListingInquiry(null);
      } else {
        toast({
          title: "Error",
          description: `Failed to update inquiry: ${result.error || "Unknown error"}`,
          variant: "destructive",
        });
      }
    },
    [setBusinessListingInquiries, setSelectedBusinessListingInquiry, setShowBusinessListingInquiryDialog, toast]
  );

  return { handleUpdateBusinessListingInquiry };
}

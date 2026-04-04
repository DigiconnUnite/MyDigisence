import { useCallback } from "react";
import { requestAdminMutation } from "./adminMutation";

interface UseRegistrationActionsOptions {
  setCreatingAccount: React.Dispatch<React.SetStateAction<string | null>>;
  setRegistrationInquiries: React.Dispatch<React.SetStateAction<any[]>>;
  setEditingBusiness: React.Dispatch<React.SetStateAction<any>>;
  setEditingProfessional: React.Dispatch<React.SetStateAction<any>>;
  setRightPanelContent: React.Dispatch<React.SetStateAction<"add-business" | "edit-business" | "add-professional" | "edit-professional" | "add-category" | "edit-category" | "create-account-from-inquiry" | null>>;
  setShowRightPanel: React.Dispatch<React.SetStateAction<boolean>>;
  setInquiryToReject: React.Dispatch<React.SetStateAction<any>>;
  setRejectReason: React.Dispatch<React.SetStateAction<string>>;
  setShowRejectInquiryDialog: React.Dispatch<React.SetStateAction<boolean>>;
  inquiryToReject: any;
  rejectReason: string;
  fetchData: () => Promise<void>;
  toast: (args: { title: string; description: string; variant?: "destructive" }) => void;
}

export function useRegistrationActions({
  setCreatingAccount,
  setRegistrationInquiries,
  setEditingBusiness,
  setEditingProfessional,
  setRightPanelContent,
  setShowRightPanel,
  setInquiryToReject,
  setRejectReason,
  setShowRejectInquiryDialog,
  inquiryToReject,
  rejectReason,
  fetchData,
  toast,
}: UseRegistrationActionsOptions) {
  const handleCreateAccountFromInquiry = useCallback(
    async (inquiry: any) => {
      if (!confirm(`Create ${inquiry.type.toLowerCase()} account for ${inquiry.name}? This will send login credentials to ${inquiry.email}.`)) {
        return;
      }

      setCreatingAccount(inquiry.id);

      try {
        const result = await requestAdminMutation(
          `/api/admin/registration-inquiries/${inquiry.id}/approve`,
          {
            method: "POST",
          },
          "Failed to approve registration inquiry"
        );

        if (!result.ok) {
          throw new Error(result.error || "Failed to approve registration inquiry");
        }

        setRegistrationInquiries((prev) =>
          prev.map((regInquiry) =>
            regInquiry.id === inquiry.id ? { ...regInquiry, status: "COMPLETED" } : regInquiry
          )
        );

        toast({
          title: "Success",
          description: `Account created and credentials sent to ${inquiry.email}`,
        });

        await fetchData();
      } catch (error) {
        toast({
          title: "Error",
          description: (error as Error).message || "Failed to create account. Please try again.",
          variant: "destructive",
        });
      } finally {
        setCreatingAccount(null);
      }
    },
    [fetchData, setCreatingAccount, setRegistrationInquiries, toast]
  );

  const handleCreateAccountFromInquiryWithSidebar = useCallback(
    (inquiry: any) => {
      setEditingBusiness(inquiry.type === "BUSINESS" ? inquiry : null);
      setEditingProfessional(inquiry.type === "PROFESSIONAL" ? inquiry : null);
      setRightPanelContent("create-account-from-inquiry");
      setShowRightPanel(true);
    },
    [setEditingBusiness, setEditingProfessional, setRightPanelContent, setShowRightPanel]
  );

  const handleRejectInquiry = useCallback(
    (inquiry: any) => {
      setInquiryToReject(inquiry);
      setRejectReason("");
      setShowRejectInquiryDialog(true);
    },
    [setInquiryToReject, setRejectReason, setShowRejectInquiryDialog]
  );

  const confirmRejectInquiry = useCallback(async () => {
    if (!inquiryToReject) return;

    setCreatingAccount(inquiryToReject.id);
    setShowRejectInquiryDialog(false);

    try {
      const result = await requestAdminMutation(
        `/api/admin/registration-inquiries/${inquiryToReject.id}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: rejectReason || "No reason provided" }),
        },
        "Failed to reject inquiry"
      );

      if (result.ok) {
        setRegistrationInquiries((prev) =>
          prev.map((regInquiry) =>
            regInquiry.id === inquiryToReject.id
              ? { ...regInquiry, status: "REJECTED", rejectReason: rejectReason || "No reason provided" }
              : regInquiry
          )
        );

        toast({ title: "Success", description: "Registration request rejected." });
        await fetchData();
      } else {
        toast({
          title: "Error",
          description: `Failed to reject inquiry: ${result.error || "Unknown error"}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreatingAccount(null);
      setInquiryToReject(null);
      setRejectReason("");
    }
  }, [fetchData, inquiryToReject, rejectReason, setCreatingAccount, setInquiryToReject, setRegistrationInquiries, setRejectReason, setShowRejectInquiryDialog, toast]);

  return {
    handleCreateAccountFromInquiry,
    handleCreateAccountFromInquiryWithSidebar,
    handleRejectInquiry,
    confirmRejectInquiry,
  };
}

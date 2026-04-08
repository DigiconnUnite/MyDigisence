import { useCallback } from "react";
import { requestBusinessMutation } from "./businessMutation";
import type {
  Inquiry,
  InquiryStatus,
  MutationSuccessResponse,
} from "../types";

export const useInquiryMutations = () => {
  const updateInquiryStatus = useCallback(async (inquiryId: string, status: InquiryStatus) => {
    return requestBusinessMutation<MutationSuccessResponse<Inquiry>>(
      `/api/business/inquiries/${inquiryId}`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      },
      "Failed to update inquiry status",
    );
  }, []);

  return {
    updateInquiryStatus,
  };
};

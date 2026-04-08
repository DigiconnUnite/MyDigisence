import { useCallback } from "react";
import { requestBusinessMutation } from "./businessMutation";
import type {
  BusinessInfoFormData,
  BusinessResponse,
  HeroContent,
  MutationSuccessResponse,
} from "../types";

export const useBusinessMutations = () => {
  const updateBusinessInfo = useCallback(async (payload: Partial<BusinessInfoFormData>) => {
    return requestBusinessMutation<MutationSuccessResponse<unknown>>(
      "/api/business",
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      "Failed to update business information",
    );
  }, []);

  const updateHeroContent = useCallback(async (heroContent: HeroContent) => {
    return requestBusinessMutation<BusinessResponse>(
      "/api/business",
      {
        method: "PUT",
        body: JSON.stringify({ heroContent }),
      },
      "Failed to save hero content",
    );
  }, []);

  const updateBrandContent = useCallback(async (brands: { name: string; logo?: string }[]) => {
    return requestBusinessMutation<MutationSuccessResponse<unknown>>(
      "/api/business",
      {
        method: "PUT",
        body: JSON.stringify({
          brandContent: { brands },
        }),
      },
      "Failed to update brand content",
    );
  }, []);

  const updatePortfolioContent = useCallback(async (images: { url: string; alt?: string }[]) => {
    return requestBusinessMutation<MutationSuccessResponse<unknown>>(
      "/api/business",
      {
        method: "PUT",
        body: JSON.stringify({
          portfolioContent: { images },
        }),
      },
      "Failed to update portfolio content",
    );
  }, []);

  return {
    updateBusinessInfo,
    updateHeroContent,
    updateBrandContent,
    updatePortfolioContent,
  };
};

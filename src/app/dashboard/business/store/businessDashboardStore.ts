import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type {
  Business,
  BusinessStats,
  Category,
  Inquiry,
  Product,
} from "../types";

export type BusinessDashboardSection =
  | "dashboard"
  | "info"
  | "hero"
  | "brands"
  | "portfolio"
  | "categories"
  | "products"
  | "inquiries"
  | "analytics"
  | "settings";

export interface BusinessDashboardState {
  business: Business | null;
  categories: Category[];
  products: Product[];
  inquiries: Inquiry[];
  stats: BusinessStats;
  isLoading: boolean;
  activeSection: BusinessDashboardSection;
  setBusiness: (business: Business | null) => void;
  setCategories: (categories: Category[]) => void;
  setProducts: (products: Product[]) => void;
  setInquiries: (inquiries: Inquiry[]) => void;
  setStats: (stats: BusinessStats) => void;
  setIsLoading: (isLoading: boolean) => void;
  setActiveSection: (section: BusinessDashboardSection) => void;
}

const initialStats: BusinessStats = {
  totalProducts: 0,
  activeProducts: 0,
  totalInquiries: 0,
  newInquiries: 0,
  readInquiries: 0,
  repliedInquiries: 0,
};

export const useBusinessDashboardStore = create<BusinessDashboardState>((set) => ({
  business: null,
  categories: [],
  products: [],
  inquiries: [],
  stats: initialStats,
  isLoading: true,
  activeSection: "dashboard",
  setBusiness: (business) => set({ business }),
  setCategories: (categories) => set({ categories }),
  setProducts: (products) => set({ products }),
  setInquiries: (inquiries) => set({ inquiries }),
  setStats: (stats) => set({ stats }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setActiveSection: (activeSection) => set({ activeSection }),
}));

export const useBusinessDashboardSummary = () =>
  useBusinessDashboardStore(
    useShallow((state) => ({
      business: state.business,
      isLoading: state.isLoading,
      activeSection: state.activeSection,
      stats: state.stats,
    })),
  );

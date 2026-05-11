export type BusinessView =
  | "dashboard"
  | "products"
  | "inquiries"
  | "categories"
  | "brands"
  | "portfolio"
  | "hero"
  | "info"
  | "analytics"
  | "settings";

export type SettingsTabId = "general" | "notifications" | "security";

interface SearchIndexItem {
  id: string;
  label: string;
  description: string;
  view: BusinessView;
  tab?: SettingsTabId;
  sectionId?: string;
  keywords: string[];
}

export const BUSINESS_SEARCH_INDEX: SearchIndexItem[] = [
  // Dashboard
  {
    id: "dashboard",
    label: "Dashboard Overview",
    description: "View your business summary and quick stats",
    view: "dashboard",
    keywords: ["dashboard", "home", "summary", "stats", "overview", "main"],
  },

  // Products
  {
    id: "products",
    label: "Products Catalog",
    description: "Manage your product listings and inventory",
    view: "products",
    keywords: ["products", "catalog", "inventory", "items", "goods", "listings", "store"],
  },

  // Inquiries
  {
    id: "inquiries",
    label: "Customer Inquiries",
    description: "View and respond to customer inquiries",
    view: "inquiries",
    keywords: ["inquiries", "messages", "customers", "leads", "contacts", "requests"],
  },

  // Categories
  {
    id: "categories",
    label: "Product Categories",
    description: "Organize your products into categories",
    view: "categories",
    keywords: ["categories", "groups", "organization", "product types", "classification"],
  },

  // Brands
  {
    id: "brands",
    label: "Brand Slider",
    description: "Manage brand logos and partnerships",
    view: "brands",
    keywords: ["brands", "logos", "partnerships", "slider", "companies"],
  },

  // Portfolio
  {
    id: "portfolio",
    label: "Portfolio Gallery",
    description: "Showcase your business portfolio and gallery",
    view: "portfolio",
    keywords: ["portfolio", "gallery", "images", "showcase", "work", "projects"],
  },

  // Hero Banner
  {
    id: "hero",
    label: "Hero Banner",
    description: "Customize your homepage banner and slides",
    view: "hero",
    keywords: ["hero", "banner", "homepage", "slides", "carousel", "cover"],
  },

  // Business Info
  {
    id: "info",
    label: "Business Information",
    description: "Update your business details and contact info",
    view: "info",
    keywords: ["info", "business details", "contact", "address", "phone", "email", "about"],
  },

  // Analytics
  {
    id: "analytics",
    label: "Analytics & Insights",
    description: "View business performance metrics and insights",
    view: "analytics",
    keywords: ["analytics", "insights", "stats", "metrics", "performance", "data", "reports"],
  },

  // Settings Tabs
  {
    id: "settings-general",
    label: "General Settings",
    description: "Manage your business account preferences",
    view: "settings",
    tab: "general",
    keywords: ["settings", "general", "preferences", "account", "business"],
  },
  {
    id: "settings-notifications",
    label: "Notification Settings",
    description: "Configure inquiry alerts and updates",
    view: "settings",
    tab: "notifications",
    keywords: ["notifications", "alerts", "emails", "updates", "inquiries"],
  },
  {
    id: "settings-security",
    label: "Security Settings",
    description: "Manage password and security options",
    view: "settings",
    tab: "security",
    keywords: ["security", "password", "login", "authentication", "settings"],
  },
];

export const VALID_BUSINESS_VIEWS: BusinessView[] = [
  "dashboard",
  "products",
  "inquiries",
  "categories",
  "brands",
  "portfolio",
  "hero",
  "info",
  "analytics",
  "settings",
];

export const VALID_SETTINGS_TABS: SettingsTabId[] = ["general", "notifications", "security"];

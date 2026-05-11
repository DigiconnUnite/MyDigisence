export type ProfessionalView =
  | "overview"
  | "analytics"
  | "my-profile"
  | "profile"
  | "reviews"
  | "services"
  | "add-service"
  | "service-requests"
  | "projects"
  | "enquiries"
  | "messages"
  | "appointments"
  | "account-settings"
  | "settings"
  | "subscription";

export type ProfileTabId =
  | "basic"
  | "experience"
  | "education"
  | "skills"
  | "services"
  | "portfolio"
  | "contact";

export type SettingsTabId = "general" | "notifications" | "privacy";

interface SearchIndexItem {
  id: string;
  label: string;
  description: string;
  view: ProfessionalView;
  tab?: ProfileTabId | SettingsTabId;
  sectionId?: string;
  keywords: string[];
}

export const PROFESSIONAL_SEARCH_INDEX: SearchIndexItem[] = [
  // Overview
  {
    id: "overview",
    label: "Dashboard Overview",
    description: "View your professional profile summary and stats",
    view: "overview",
    keywords: ["dashboard", "home", "summary", "stats", "overview", "main"],
  },

  // Analytics
  {
    id: "analytics",
    label: "Analytics & Insights",
    description: "View profile views and performance metrics",
    view: "analytics",
    keywords: ["analytics", "insights", "stats", "views", "metrics", "performance", "data"],
  },

  // Profile Views
  {
    id: "my-profile",
    label: "My Profile",
    description: "View your professional profile",
    view: "my-profile",
    keywords: ["profile", "view", "professional", "public", "showcase"],
  },
  {
    id: "profile",
    label: "Edit Profile",
    description: "Edit your professional profile information",
    view: "profile",
    keywords: ["profile", "edit", "update", "modify", "change"],
  },
  {
    id: "reviews",
    label: "Reviews",
    description: "View and respond to client reviews",
    view: "reviews",
    keywords: ["reviews", "ratings", "feedback", "testimonials", "client feedback"],
  },

  // Services & Business
  {
    id: "services",
    label: "My Services",
    description: "Manage your service offerings",
    view: "services",
    keywords: ["services", "offerings", "products", "pricing", "freelance"],
  },
  {
    id: "add-service",
    label: "Add Service",
    description: "Add a new service to your offerings",
    view: "add-service",
    keywords: ["add", "service", "create", "new", "offering"],
  },
  {
    id: "service-requests",
    label: "Service Requests",
    description: "View and manage client service requests",
    view: "service-requests",
    keywords: ["requests", "service", "client", "proposals", "leads"],
  },
  {
    id: "projects",
    label: "My Projects",
    description: "View and manage your portfolio projects",
    view: "projects",
    keywords: ["projects", "portfolio", "work", "samples", "gallery"],
  },

  // Client Engagement
  {
    id: "enquiries",
    label: "Client Inquiries",
    description: "View and manage inquiries from potential clients",
    view: "enquiries",
    keywords: ["inquiries", "messages", "leads", "clients", "contact", "requests"],
  },
  {
    id: "messages",
    label: "Messages",
    description: "Chat with clients and manage conversations",
    view: "messages",
    keywords: ["messages", "chat", "conversations", "communication", "clients"],
  },
  {
    id: "appointments",
    label: "Appointments",
    description: "Manage your schedule and bookings",
    view: "appointments",
    keywords: ["appointments", "bookings", "schedule", "calendar", "meetings"],
  },

  // Customization
  {
    id: "theme",
    label: "Theme Settings",
    description: "Customize the appearance of your public profile",
    view: "theme",
    keywords: ["theme", "appearance", "design", "customize", "style", "colors", "layout"],
  },

  // Account Management
  {
    id: "account-settings",
    label: "Account Settings",
    description: "Manage your account preferences",
    view: "account-settings",
    keywords: ["settings", "account", "preferences", "profile settings"],
  },
  {
    id: "settings",
    label: "Preferences",
    description: "Manage your application preferences",
    view: "settings",
    keywords: ["preferences", "settings", "general", "configuration"],
  },
  {
    id: "subscription",
    label: "Subscription",
    description: "Manage your subscription and billing",
    view: "subscription",
    keywords: ["subscription", "plan", "billing", "payment", "upgrade"],
  },
];

export const VALID_PROFESSIONAL_VIEWS: ProfessionalView[] = [
  "overview",
  "analytics",
  "my-profile",
  "profile",
  "reviews",
  "services",
  "add-service",
  "service-requests",
  "projects",
  "enquiries",
  "messages",
  "appointments",
  "theme",
  "account-settings",
  "settings",
  "subscription",
];

export const VALID_PROFILE_TABS: ProfileTabId[] = [
  "basic",
  "experience",
  "education",
  "skills",
  "services",
  "portfolio",
  "contact",
];

export const VALID_SETTINGS_TABS: SettingsTabId[] = ["general", "notifications", "privacy"];

export type AdminView =
  | "dashboard"
  | "businesses"
  | "professionals"
  | "blogs"
  | "categories"
  | "inquiries"
  | "registration-requests"
  | "business-listings"
  | "analytics"
  | "settings";

export type SettingsTabId = "general" | "security" | "notifications";

export interface AdminSearchItem {
  id: string;
  label: string;
  description: string;
  view: AdminView;
  tab?: SettingsTabId;
  sectionId?: string;
  keywords: string[];
}

export const ADMIN_SEARCH_INDEX: AdminSearchItem[] = [
  {
    id: "view-dashboard",
    label: "Dashboard Overview",
    description: "Open the main admin dashboard overview",
    view: "dashboard",
    keywords: ["home", "overview", "dashboard", "admin"],
  },
  {
    id: "view-businesses",
    label: "Manage Businesses",
    description: "View and manage all registered businesses",
    view: "businesses",
    keywords: ["business", "company", "listing", "merchant"],
  },
  {
    id: "view-professionals",
    label: "Manage Professionals",
    description: "View and manage all professionals",
    view: "professionals",
    keywords: ["professional", "profile", "expert", "service"],
  },
  {
    id: "view-blogs",
    label: "Manage Blogs",
    description: "Create and publish blog posts from Super Admin",
    view: "blogs",
    keywords: ["blog", "article", "content", "post", "publish"],
  },
  {
    id: "view-categories",
    label: "Manage Categories",
    description: "View and manage business categories",
    view: "categories",
    keywords: ["category", "taxonomy", "group", "classification"],
  },
  {
    id: "view-inquiries",
    label: "Contact Inquiries",
    description: "View incoming contact inquiries",
    view: "inquiries",
    keywords: ["inquiry", "contact", "message", "support"],
  },
  {
    id: "view-registration",
    label: "Registration Requests",
    description: "Review business and professional registration requests",
    view: "registration-requests",
    keywords: ["registration", "request", "approval", "pending"],
  },
  {
    id: "view-business-listings",
    label: "Business Listing Inquiries",
    description: "Review business listing inquiries",
    view: "business-listings",
    keywords: ["listing", "digital", "presence", "business inquiry"],
  },
  {
    id: "view-analytics",
    label: "Platform Analytics",
    description: "Open analytics dashboards and metrics",
    view: "analytics",
    keywords: ["analytics", "stats", "metrics", "charts"],
  },
  {
    id: "view-settings",
    label: "System Settings",
    description: "Open all system settings",
    view: "settings",
    tab: "general",
    keywords: ["settings", "configuration", "preferences", "system"],
  },
  {
    id: "settings-general-platform-name",
    label: "Settings / General / Platform Name",
    description: "Go to platform name setting",
    view: "settings",
    tab: "general",
    sectionId: "settings-general-platform-name",
    keywords: ["platform", "name", "brand", "title"],
  },
  {
    id: "settings-general-admin-email",
    label: "Settings / General / Admin Email",
    description: "Go to admin email setting",
    view: "settings",
    tab: "general",
    sectionId: "settings-general-admin-email",
    keywords: ["admin", "email", "mail", "contact"],
  },
  {
    id: "settings-general-brand-accent",
    label: "Settings / General / Brand Accent",
    description: "Go to brand accent setting",
    view: "settings",
    tab: "general",
    sectionId: "settings-general-brand-accent",
    keywords: ["brand", "accent", "color", "theme"],
  },
  {
    id: "settings-security-policy",
    label: "Settings / Security / Security Policy",
    description: "Go to security policy setting",
    view: "settings",
    tab: "security",
    sectionId: "settings-security-policy",
    keywords: ["security", "policy", "password", "rules"],
  },
  {
    id: "settings-security-session-timeout",
    label: "Settings / Security / Session Timeout",
    description: "Go to session timeout setting",
    view: "settings",
    tab: "security",
    sectionId: "settings-security-session-timeout",
    keywords: ["session", "timeout", "inactive", "expiry"],
  },
  {
    id: "settings-security-two-factor",
    label: "Settings / Security / Two Factor Authentication",
    description: "Go to two factor authentication setting",
    view: "settings",
    tab: "security",
    sectionId: "settings-security-two-factor",
    keywords: ["2fa", "mfa", "otp", "two factor"],
  },
  {
    id: "settings-notification-email-alerts",
    label: "Settings / Notifications / Email Alerts",
    description: "Go to email alerts setting",
    view: "settings",
    tab: "notifications",
    sectionId: "settings-notification-email-alerts",
    keywords: ["email", "alerts", "notification", "mail"],
  },
  {
    id: "settings-notification-push",
    label: "Settings / Notifications / Push Notifications",
    description: "Go to push notification setting",
    view: "settings",
    tab: "notifications",
    sectionId: "settings-notification-push",
    keywords: ["push", "notification", "mobile", "device"],
  },
  {
    id: "settings-notification-digest",
    label: "Settings / Notifications / Digest Frequency",
    description: "Go to digest frequency setting",
    view: "settings",
    tab: "notifications",
    sectionId: "settings-notification-digest",
    keywords: ["digest", "frequency", "daily", "summary"],
  },
];

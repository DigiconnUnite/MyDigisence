"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  Mail,
  Smartphone,
  CreditCard,
  Lock,
  Key,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Link2,
  Zap,
  Database,
  Users,
  FileText,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SettingsViewProps {
  isLoading?: boolean;
}

interface GeneralSettings {
  displayName: string;
  username: string;
  email: string;
  phone: string;
  timezone: string;
  language: string;
  bio: string;
  location: string;
  website: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  inquiryAlerts: boolean;
  messageAlerts: boolean;
  appointmentReminders: boolean;
  reviewNotifications: boolean;
  weeklyReports: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

interface PrivacySettings {
  profileVisibility: "public" | "private" | "unlisted";
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  allowMessages: boolean;
  allowReviews: boolean;
  searchEngineIndexing: boolean;
  dataSharing: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  lastPasswordChange: string;
  activeSessions: Array<{
    id: string;
    device: string;
    location: string;
    lastActive: string;
  }>;
  loginAlerts: boolean;
  backupCodes: boolean;
}

const timezones = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Portuguese",
];

export default function SettingsView({ isLoading = false }: SettingsViewProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    displayName: user?.name || "",
    username: "",
    email: user?.email || "",
    phone: "",
    timezone: "UTC",
    language: "English",
    bio: "",
    location: "",
    website: "",
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    inquiryAlerts: true,
    messageAlerts: true,
    appointmentReminders: true,
    reviewNotifications: true,
    weeklyReports: true,
    marketingEmails: false,
    securityAlerts: true,
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessages: true,
    allowReviews: true,
    searchEngineIndexing: true,
    dataSharing: false,
    twoFactorAuth: false,
    sessionTimeout: 24,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    lastPasswordChange: "2024-01-15",
    activeSessions: [
      {
        id: "1",
        device: "Chrome on Windows",
        location: "New York, US",
        lastActive: "2 minutes ago",
      },
      {
        id: "2",
        device: "Safari on iPhone",
        location: "New York, US",
        lastActive: "1 hour ago",
      },
    ],
    loginAlerts: true,
    backupCodes: false,
  });

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      // Save general settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: "Your general settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Notifications Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notifications.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Privacy Updated",
        description: "Your privacy settings have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowPasswordDialog(false);
      setSecuritySettings(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      setSecuritySettings(prev => ({
        ...prev,
        activeSessions: prev.activeSessions.filter(session => session.id !== sessionId),
      }));
      toast({
        title: "Session Revoked",
        description: "The session has been revoked successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke session.",
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    // Export user data
    const userData = {
      general: generalSettings,
      notifications: notificationSettings,
      privacy: privacySettings,
    };
    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "my-data.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                <Button
                  variant={activeTab === "general" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("general")}
                >
                  <User className="h-4 w-4 mr-2" />
                  General
                </Button>
                <Button
                  variant={activeTab === "notifications" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button
                  variant={activeTab === "privacy" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("privacy")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy
                </Button>
                <Button
                  variant={activeTab === "security" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("security")}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {/* General Settings */}
          {activeTab === "general" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input
                      value={generalSettings.displayName}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input
                      value={generalSettings.username}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={generalSettings.email}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={generalSettings.phone}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                      value={generalSettings.timezone}
                      onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((timezone) => (
                          <SelectItem key={timezone} value={timezone}>
                            {timezone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={generalSettings.language}
                      onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={generalSettings.bio}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={generalSettings.location}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      type="url"
                      value={generalSettings.website}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveGeneral} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                      </div>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Inquiry Alerts</Label>
                        <p className="text-sm text-gray-500">New client inquiries</p>
                      </div>
                      <Switch
                        checked={notificationSettings.inquiryAlerts}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, inquiryAlerts: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Message Alerts</Label>
                        <p className="text-sm text-gray-500">New messages from clients</p>
                      </div>
                      <Switch
                        checked={notificationSettings.messageAlerts}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, messageAlerts: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Appointment Reminders</Label>
                        <p className="text-sm text-gray-500">Upcoming appointments</p>
                      </div>
                      <Switch
                        checked={notificationSettings.appointmentReminders}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, appointmentReminders: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Review Notifications</Label>
                        <p className="text-sm text-gray-500">New client reviews</p>
                      </div>
                      <Switch
                        checked={notificationSettings.reviewNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, reviewNotifications: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Reports</Label>
                        <p className="text-sm text-gray-500">Weekly performance summary</p>
                      </div>
                      <Switch
                        checked={notificationSettings.weeklyReports}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Marketing Emails</Label>
                        <p className="text-sm text-gray-500">Promotional content and updates</p>
                      </div>
                      <Switch
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Security Alerts</Label>
                        <p className="text-sm text-gray-500">Security-related notifications</p>
                      </div>
                      <Switch
                        checked={notificationSettings.securityAlerts}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, securityAlerts: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy Settings */}
          {activeTab === "privacy" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Visibility</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Profile Visibility</Label>
                      <Select
                        value={privacySettings.profileVisibility}
                        onValueChange={(value: any) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public - Anyone can view</SelectItem>
                          <SelectItem value="unlisted">Unlisted - Not searchable</SelectItem>
                          <SelectItem value="private">Private - Only you</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Email</Label>
                        <p className="text-sm text-gray-500">Display email on profile</p>
                      </div>
                      <Switch
                        checked={privacySettings.showEmail}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showEmail: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Phone</Label>
                        <p className="text-sm text-gray-500">Display phone number on profile</p>
                      </div>
                      <Switch
                        checked={privacySettings.showPhone}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showPhone: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Location</Label>
                        <p className="text-sm text-gray-500">Display location on profile</p>
                      </div>
                      <Switch
                        checked={privacySettings.showLocation}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showLocation: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Interaction Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Allow Messages</Label>
                        <p className="text-sm text-gray-500">Let clients send you messages</p>
                      </div>
                      <Switch
                        checked={privacySettings.allowMessages}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowMessages: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Allow Reviews</Label>
                        <p className="text-sm text-gray-500">Let clients leave reviews</p>
                      </div>
                      <Switch
                        checked={privacySettings.allowReviews}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowReviews: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data & Security</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Search Engine Indexing</Label>
                        <p className="text-sm text-gray-500">Allow search engines to index your profile</p>
                      </div>
                      <Switch
                        checked={privacySettings.searchEngineIndexing}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, searchEngineIndexing: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Data Sharing</Label>
                        <p className="text-sm text-gray-500">Share anonymized data for analytics</p>
                      </div>
                      <Switch
                        checked={privacySettings.dataSharing}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, dataSharing: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                      <Switch
                        checked={privacySettings.twoFactorAuth}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Session Timeout (hours)</Label>
                      <Select
                        value={privacySettings.sessionTimeout.toString()}
                        onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, sessionTimeout: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hour</SelectItem>
                          <SelectItem value="6">6 hours</SelectItem>
                          <SelectItem value="24">24 hours</SelectItem>
                          <SelectItem value="168">1 week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSavePrivacy} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Change Password</h3>
                        <p className="text-sm text-gray-500">Last changed: {securitySettings.lastPasswordChange}</p>
                      </div>
                      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline">Change Password</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>
                              Enter your current password and choose a new one.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Current Password</Label>
                              <div className="relative">
                                <Input
                                  type={showCurrentPassword ? "text" : "password"}
                                  value={securitySettings.currentPassword}
                                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                                  placeholder="Enter current password"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                  {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>New Password</Label>
                              <div className="relative">
                                <Input
                                  type={showNewPassword ? "text" : "password"}
                                  value={securitySettings.newPassword}
                                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, newPassword: e.target.value }))}
                                  placeholder="Enter new password"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                  {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Confirm New Password</Label>
                              <div className="relative">
                                <Input
                                  type={showConfirmPassword ? "text" : "password"}
                                  value={securitySettings.confirmPassword}
                                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                  placeholder="Confirm new password"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleChangePassword} disabled={isSaving}>
                              {isSaving ? "Changing..." : "Change Password"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Login Alerts</Label>
                        <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                      </div>
                      <Switch
                        checked={securitySettings.loginAlerts}
                        onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, loginAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Backup Codes</Label>
                        <p className="text-sm text-gray-500">Generate backup codes for account recovery</p>
                      </div>
                      <Switch
                        checked={securitySettings.backupCodes}
                        onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, backupCodes: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Active Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {securitySettings.activeSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Smartphone className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{session.device}</h4>
                          <p className="text-sm text-gray-500">{session.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Last active</p>
                          <p className="text-sm font-medium">{session.lastActive}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeSession(session.id)}
                        >
                          Revoke
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-red-600">Delete Account</h4>
                      <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                    </div>
                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                      <DialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-red-600">Delete Account</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove all data.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-red-50 rounded-lg">
                            <h4 className="font-medium text-red-800 mb-2">This will delete:</h4>
                            <ul className="text-sm text-red-700 space-y-1">
                              <li>• Your profile information</li>
                              <li>• All services and portfolio items</li>
                              <li>• Client messages and inquiries</li>
                              <li>• Reviews and ratings</li>
                              <li>• Account settings and preferences</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <Label>Type "DELETE" to confirm</Label>
                            <Input placeholder="DELETE" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive">
                            Delete Account
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

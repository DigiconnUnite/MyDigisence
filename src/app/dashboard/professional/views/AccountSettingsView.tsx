"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Mail, Lock, Smartphone, Globe, Bell, Shield, 
  Save, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountSettingsViewProps {
  isLoading?: boolean;
}

export default function AccountSettingsView({ isLoading = false }: AccountSettingsViewProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "Shivam Thakur",
    email: "shivam@example.com",
    phone: "+91 98765 43210",
    website: "https://shivam.dev",
    location: "Agra, Uttar Pradesh, India",
    bio: "Full Stack Developer passionate about building scalable web applications.",
  });

  const [notifications, setNotifications] = useState({
    emailEnquiries: true,
    emailMessages: true,
    emailReviews: true,
    pushEnquiries: false,
    pushMessages: true,
    marketingEmails: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    publicProfile: true,
    showEmail: false,
    showPhone: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 rounded-lg" />
        <div className="h-96 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account preferences and settings</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as string)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Profile Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input 
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input 
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input 
                  value={profileData.website}
                  onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Location</Label>
                <Input 
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Bio</Label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md resize-y"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-semibold">Email Notifications</h2>
            </div>
            <div className="space-y-4">
              {[
                { key: "emailEnquiries", label: "New Enquiries", description: "Get notified when someone sends you an enquiry" },
                { key: "emailMessages", label: "New Messages", description: "Get notified when you receive a new message" },
                { key: "emailReviews", label: "New Reviews", description: "Get notified when someone leaves a review" },
                { key: "marketingEmails", label: "Marketing Emails", description: "Receive updates about new features and promotions" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked: boolean) => 
                      setNotifications({ ...notifications, [item.key]: checked })
                    }
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Smartphone className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold">Push Notifications</h2>
            </div>
            <div className="space-y-4">
              {[
                { key: "pushEnquiries", label: "Enquiry Alerts", description: "Push notifications for new enquiries" },
                { key: "pushMessages", label: "Message Alerts", description: "Push notifications for new messages" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked: boolean) => 
                      setNotifications({ ...notifications, [item.key]: checked })
                    }
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold">Change Password</h2>
            </div>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button className="w-full">Update Password</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold">Security Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={security.twoFactor}
                  onCheckedChange={(checked: boolean) => setSecurity({ ...security, twoFactor: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Login Alerts</p>
                  <p className="text-sm text-gray-500">Get notified of suspicious login attempts</p>
                </div>
                <Switch
                  checked={security.loginAlerts}
                  onCheckedChange={(checked: boolean) => setSecurity({ ...security, loginAlerts: checked })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Profile Visibility</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">Public Profile</p>
                  <p className="text-sm text-gray-500">Make your profile visible to everyone</p>
                </div>
                <Switch
                  checked={security.publicProfile}
                  onCheckedChange={(checked: boolean) => setSecurity({ ...security, publicProfile: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">Show Email Address</p>
                  <p className="text-sm text-gray-500">Display your email on your public profile</p>
                </div>
                <Switch
                  checked={security.showEmail}
                  onCheckedChange={(checked: boolean) => setSecurity({ ...security, showEmail: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Show Phone Number</p>
                  <p className="text-sm text-gray-500">Display your phone on your public profile</p>
                </div>
                <Switch
                  checked={security.showPhone}
                  onCheckedChange={(checked: boolean) => setSecurity({ ...security, showPhone: checked })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

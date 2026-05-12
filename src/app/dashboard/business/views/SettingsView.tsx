"use client";

import React from "react";
import { memo } from "react";
import { Settings, Bell, Shield, Palette, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface SettingsViewProps {
  business: any;
  onBusinessUpdate: (data: any) => void;
}

export default memo(function SettingsView({ business, onBusinessUpdate }: SettingsViewProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
          Business Settings
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Manage your business preferences and configurations
        </p>
      </div>

      {/* Notification Settings */}
      <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-400" />
            <CardTitle>Notification Settings</CardTitle>
          </div>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive email updates for inquiries</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Push Notifications</p>
              <p className="text-xs text-gray-500">Receive browser notifications</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Weekly Summary</p>
              <p className="text-xs text-gray-500">Receive weekly performance reports</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-400" />
            <CardTitle>Privacy Settings</CardTitle>
          </div>
          <CardDescription>Manage your privacy and security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Profile Visibility</p>
              <p className="text-xs text-gray-500">Make your profile publicly visible</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Contact Information</p>
              <p className="text-xs text-gray-500">Show contact details on public profile</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-gray-400" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Dark Mode</p>
              <p className="text-xs text-gray-500">Use dark theme for the dashboard</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Compact View</p>
              <p className="text-xs text-gray-500">Use more compact layout</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Integration Settings */}
      <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-gray-400" />
            <CardTitle>Integrations</CardTitle>
          </div>
          <CardDescription>Connect with third-party services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-900">Social Media</p>
              <Button variant="outline" size="sm" className="rounded-xl">
                Configure
              </Button>
            </div>
            <p className="text-xs text-gray-500">Connect your social media accounts</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-900">Email Marketing</p>
              <Button variant="outline" size="sm" className="rounded-xl">
                Connect
              </Button>
            </div>
            <p className="text-xs text-gray-500">Integrate with email marketing tools</p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="rounded-3xl border-red-200 transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-900">Danger Zone</CardTitle>
          </div>
          <CardDescription className="text-red-700">
            Irreversible actions for your business account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-red-50 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-red-900">Delete Business Account</p>
                <p className="text-xs text-red-700">
                  Permanently delete your business and all associated data
                </p>
              </div>
              <Button variant="destructive" size="sm" className="rounded-xl">
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

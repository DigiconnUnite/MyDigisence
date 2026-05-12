"use client";

import React from "react";
import { memo } from "react";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Link2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface IntegrationSettingsProps {
  business: any;
  onBusinessUpdate: (data: any) => void;
}

export default memo(function IntegrationSettings({ business, onBusinessUpdate }: IntegrationSettingsProps) {
  const socialPlatforms = [
    { name: "Facebook", icon: Facebook, connected: !!business?.facebook, color: "text-blue-600" },
    { name: "Twitter", icon: Twitter, connected: !!business?.twitter, color: "text-sky-500" },
    { name: "LinkedIn", icon: Linkedin, connected: !!business?.linkedin, color: "text-blue-700" },
    { name: "Instagram", icon: Instagram, connected: !!business?.instagram, color: "text-pink-600" },
  ];

  const emailPlatforms = [
    { name: "Mailchimp", icon: Mail, connected: false, color: "text-orange-600" },
    { name: "SendGrid", icon: Mail, connected: false, color: "text-blue-500" },
    { name: "Custom SMTP", icon: Mail, connected: false, color: "text-gray-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Social Media Integration */}
      <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle>Social Media Integration</CardTitle>
          <CardDescription>Connect your social media accounts for better reach</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialPlatforms.map((platform) => (
            <div key={platform.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-3xl">
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-white rounded-2xl shadow-sm`}>
                  <platform.icon className={`h-5 w-5 ${platform.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{platform.name}</p>
                  <p className="text-xs text-gray-500">
                    {platform.connected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {platform.connected ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <Button variant="outline" size="sm" className="rounded-xl">
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-gray-400" />
                    <Button size="sm" className="rounded-xl">
                      Connect
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Email Marketing Integration */}
      <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle>Email Marketing Integration</CardTitle>
          <CardDescription>Connect with email marketing platforms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emailPlatforms.map((platform) => (
            <div key={platform.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-3xl">
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-white rounded-2xl shadow-sm`}>
                  <platform.icon className={`h-5 w-5 ${platform.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{platform.name}</p>
                  <p className="text-xs text-gray-500">
                    {platform.connected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {platform.connected ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <Button variant="outline" size="sm" className="rounded-xl">
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-gray-400" />
                    <Button size="sm" className="rounded-xl">
                      Connect
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* API Integration */}
      <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-gray-400" />
            <CardTitle>API Integration</CardTitle>
          </div>
          <CardDescription>Manage API keys and webhooks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-3xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-900">API Key</p>
                <p className="text-xs text-gray-500">Your secret API key for integrations</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">
                Regenerate
              </Button>
            </div>
            <div className="bg-white p-3 rounded-2xl font-mono text-xs text-gray-600">
              ••••••••••••••••••••••••••••••••
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-3xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Webhook Notifications</p>
              <p className="text-xs text-gray-500">Receive webhook events for updates</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

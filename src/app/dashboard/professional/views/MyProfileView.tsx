"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, MapPin, Mail, Phone, Globe, Linkedin, Twitter, Facebook, Instagram,
  Briefcase, GraduationCap, Award, Wrench, ExternalLink, Edit3, Shield, Star
} from "lucide-react";

interface MyProfileViewProps {
  professional?: {
    id?: string;
    name?: string;
    professionalHeadline?: string | null;
    aboutMe?: string | null;
    profilePicture?: string | null;
    banner?: string | null;
    location?: string | null;
    email?: string | null;
    phone?: string | null;
    website?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    isVerified?: boolean;
  } | null;
  services?: Array<{ name: string; price?: string | number | null }>;
  portfolio?: Array<{ title?: string; description?: string; url?: string }>;
  workExperience?: Array<{ position: string; company: string; location?: string; startMonth: string; startYear: string; endMonth?: string; endYear?: string; isCurrent: boolean }>;
  education?: Array<{ degree: string; institution: string; year: string; description?: string }>;
  skills?: Array<{ name: string; level: string }>;
  isLoading?: boolean;
  onEdit?: () => void;
  onViewPublic?: () => void;
}

export default function MyProfileView({ 
  professional, 
  services,
  portfolio,
  workExperience,
  education,
  skills,
  isLoading = false, 
  onEdit, 
  onViewPublic 
}: MyProfileViewProps) {
  const data = professional || {};
  const servicesData = services || [];
  const portfolioData = portfolio || [];
  const experienceData = workExperience || [];
  const educationData = education || [];
  const skillsData = skills || [];

  const stats = useMemo(() => {
    const projectsCount = portfolioData.length;
    return {
      projects: projectsCount,
      clients: 0,
      rating: 0,
    };
  }, [portfolioData.length]);

  const nameInitials = (data.name || "").split(" ").filter(Boolean).map((n) => n[0]).join("") || "P";

  const formatPrice = (value?: string | number | null) => {
    if (value == null) {
      return "-";
    }
    const price = typeof value === "number" ? value : Number(value);
    return Number.isFinite(price) ? `$${price.toLocaleString()}` : "-";
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-48 bg-gray-200 rounded-xl" />
        <div className="h-96 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your professional profile</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onViewPublic}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View Public
          </Button>
          <Button onClick={onEdit}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="overflow-hidden">
        {/* Banner */}
        <div className="relative h-32 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600">
          {data.banner ? (
            <Image
              src={data.banner}
              alt={data.name ? `${data.name} banner` : "Profile banner"}
              fill
              className="object-cover"
            />
          ) : null}
        </div>
        
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-12 mb-4 gap-4">
            <Avatar className="h-24 w-24 border-4 border-white">
              {data.profilePicture ? (
                <Image
                  src={data.profilePicture}
                  alt={data.name || "Profile"}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-2xl">
                  {nameInitials}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 mb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">{data.name || "Your profile"}</h2>
                {data.isVerified && (
                  <Badge className="bg-blue-100 text-blue-700">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">{data.professionalHeadline || "Add a professional headline"}</p>
            </div>
            <div className="flex items-center gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.projects}</p>
                <p className="text-xs text-gray-500">Projects</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.clients}</p>
                <p className="text-xs text-gray-500">Clients</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 flex items-center gap-1">
                  {stats.rating.toFixed(1)} <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Content */}
      <Tabs defaultValue="about" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
            <p className="text-gray-600 leading-relaxed">{data.aboutMe || "Add a short bio to introduce yourself."}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{data.location || "Location not set"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{data.email || "Email not set"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{data.phone || "Phone not set"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{data.website || "Website not set"}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t">
              {data.linkedin && <Button variant="outline" size="sm"><Linkedin className="h-4 w-4 mr-2" />LinkedIn</Button>}
              {data.twitter && <Button variant="outline" size="sm"><Twitter className="h-4 w-4 mr-2" />Twitter</Button>}
              {data.facebook && <Button variant="outline" size="sm"><Facebook className="h-4 w-4 mr-2" />Facebook</Button>}
              {data.instagram && <Button variant="outline" size="sm"><Instagram className="h-4 w-4 mr-2" />Instagram</Button>}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Offered</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {servicesData.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                  No services yet. Add services to show them here.
                </div>
              ) : (
                servicesData.map((service, i) => (
                  <div key={`${service.name}-${i}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Wrench className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">{service.name}</span>
                    </div>
                    <span className="text-gray-600">{formatPrice(service.price)}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>
            <div className="space-y-4">
              {experienceData.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                  No work experience yet.
                </div>
              ) : (
                experienceData.map((exp, i) => {
                  const duration = exp.isCurrent
                    ? `${exp.startMonth} ${exp.startYear} - Present`
                    : `${exp.startMonth} ${exp.startYear} - ${exp.endMonth || ""} ${exp.endYear || ""}`.trim();

                  return (
                    <div key={`${exp.company}-${exp.position}-${i}`} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">{duration}{exp.location ? ` • ${exp.location}` : ""}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
            <div className="space-y-4">
              {educationData.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                  No education added yet.
                </div>
              ) : (
                educationData.map((edu, i) => (
                  <div key={`${edu.institution}-${edu.degree}-${i}`} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-3">
              {skillsData.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                  No skills added yet.
                </div>
              ) : (
                skillsData.map((skill, i) => (
                  <Badge key={`${skill.name}-${i}`} variant="secondary" className="px-3 py-1.5 text-sm">
                    <Award className="h-3.5 w-3.5 mr-1.5" />
                    {skill.name}
                    <span className="ml-2 text-xs text-gray-500 capitalize">({skill.level})</span>
                  </Badge>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolioData.length === 0 ? (
                <div className="col-span-full rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                  No portfolio items yet.
                </div>
              ) : (
                portfolioData.map((item, i) => (
                  <div key={`${item.title || "portfolio"}-${i}`} className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-video">
                    {item.url ? (
                      <Image
                        src={item.url}
                        alt={item.title || "Portfolio"}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <h4 className="font-semibold">{item.title || "Project"}</h4>
                      <p className="text-sm text-white/80">{item.description || ""}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

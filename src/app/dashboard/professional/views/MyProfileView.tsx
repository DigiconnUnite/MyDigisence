"use client";

import React from "react";
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
  professional?: any;
  isLoading?: boolean;
  onEdit?: () => void;
  onViewPublic?: () => void;
}

const defaultProfessional = {
  name: "Shivam Thakur",
  headline: "Full Stack Developer",
  about: "Passionate full stack developer with expertise in building scalable web applications. I love turning ideas into real-world digital products.",
  location: "Agra, Uttar Pradesh, India",
  email: "shivam@example.com",
  phone: "+91 98765 43210",
  website: "https://shivam.dev",
  linkedin: "linkedin.com/in/shivam",
  twitter: "@shivam",
  facebook: "facebook.com/shivam",
  instagram: "@shivam",
  isVerified: true,
  isActive: true,
  skills: [
    { name: "React", level: "expert" },
    { name: "Node.js", level: "expert" },
    { name: "TypeScript", level: "expert" },
    { name: "Python", level: "intermediate" },
    { name: "AWS", level: "intermediate" },
  ],
  experience: [
    { position: "Senior Developer", company: "Tech Corp", duration: "2022 - Present", location: "Remote" },
    { position: "Full Stack Developer", company: "Startup Inc", duration: "2020 - 2022", location: "Bangalore" },
  ],
  education: [
    { degree: "B.Tech Computer Science", institution: "IIT Delhi", year: "2020" },
  ],
  services: [
    { name: "Web Development", price: 35000 },
    { name: "API Development", price: 25000 },
  ],
  portfolio: [
    { title: "E-Commerce Platform", category: "Web App", image: "/project-1.jpg" },
    { title: "Task Management App", category: "SaaS", image: "/project-2.jpg" },
  ],
  stats: { projects: 120, clients: 80, experience: 5, rating: 4.8 }
};

export default function MyProfileView({ 
  professional, 
  isLoading = false, 
  onEdit, 
  onViewPublic 
}: MyProfileViewProps) {
  const data = { ...defaultProfessional, ...professional };

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
        <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
        
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-12 mb-4 gap-4">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                {data.name.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 mb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">{data.name}</h2>
                {data.isVerified && (
                  <Badge className="bg-blue-100 text-blue-700">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">{data.headline}</p>
            </div>
            <div className="flex items-center gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-gray-900">{data.stats.projects}+</p>
                <p className="text-xs text-gray-500">Projects</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{data.stats.clients}+</p>
                <p className="text-xs text-gray-500">Clients</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 flex items-center gap-1">
                  {data.stats.rating} <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
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
            <p className="text-gray-600 leading-relaxed">{data.about}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{data.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{data.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{data.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{data.website}</span>
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
              {data.services.map((service: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">{service.name}</span>
                  </div>
                  <span className="text-gray-600">${service.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>
            <div className="space-y-4">
              {data.experience.map((exp: any, i: number) => (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.duration} • {exp.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
            <div className="space-y-4">
              {data.education.map((edu: any, i: number) => (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill: any, i: number) => (
                <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm">
                  <Award className="h-3.5 w-3.5 mr-1.5" />
                  {skill.name}
                  <span className="ml-2 text-xs text-gray-500 capitalize">({skill.level})</span>
                </Badge>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.portfolio.map((item: any, i: number) => (
                <div key={i} className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-video">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <p className="text-sm text-white/80">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

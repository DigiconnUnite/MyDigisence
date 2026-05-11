"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Professional, WorkExperience, Education, Service, PortfolioItem, Skill } from "../types/professional";

interface ProfessionalData {
  professional: Professional | null;
  workExperience: WorkExperience[];
  education: Education[];
  services: Service[];
  portfolio: PortfolioItem[];
  skills: Skill[];
  loading: boolean;
}

interface UseProfessionalDataReturn extends ProfessionalData {
  fetchData: () => Promise<void>;
  updateField: (field: string, value: string) => Promise<boolean>;
  updateServices: (services: Service[]) => Promise<boolean>;
  updatePortfolio: (portfolio: PortfolioItem[]) => Promise<boolean>;
  updateSkills: (skills: Skill[]) => Promise<boolean>;
  updateExperience: (experience: WorkExperience[]) => Promise<boolean>;
  updateEducation: (education: Education[]) => Promise<boolean>;
  createProfessional: (name: string, professionalHeadline: string) => Promise<boolean>;
}

export function useProfessionalData(): UseProfessionalDataReturn {
  const { toast } = useToast();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/professionals/me", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setProfessional(null);
          return;
        }
        throw new Error("Failed to fetch professional data");
      }

      const data = await response.json();
      setProfessional(data.professional);

      // Fetch related data in parallel
      const [expRes, eduRes, svcRes, portRes, skillRes] = await Promise.all([
        fetch("/api/professionals/experience", { cache: "no-store" }),
        fetch("/api/professionals/education", { cache: "no-store" }),
        fetch("/api/professionals/services", { cache: "no-store" }),
        fetch("/api/professionals/portfolio", { cache: "no-store" }),
        fetch("/api/professionals/skills", { cache: "no-store" }),
      ]);

      const [expData, eduData, svcData, portData, skillData] = await Promise.all([
        expRes.ok ? expRes.json() : { workExperience: [] },
        eduRes.ok ? eduRes.json() : { education: [] },
        svcRes.ok ? svcRes.json() : { services: [] },
        portRes.ok ? portRes.json() : { portfolio: [] },
        skillRes.ok ? skillRes.json() : { skills: [] },
      ]);

      setWorkExperience(expData.workExperience || []);
      setEducation(eduData.education || []);
      setServices(svcData.services || []);
      setPortfolio(portData.portfolio || []);
      setSkills(skillData.skills || []);
    } catch (error) {
      console.error("Error fetching professional data:", error);
      toast({
        title: "Error",
        description: "Failed to load professional data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateField = useCallback(async (field: string, value: string): Promise<boolean> => {
    if (!professional) return false;

    try {
      const response = await fetch("/api/professionals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) throw new Error("Failed to update field");

      const data = await response.json();
      setProfessional((prev) => (prev ? { ...prev, ...data.professional } : null));

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      return true;
    } catch (error) {
      console.error("Error updating field:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return false;
    }
  }, [professional, toast]);

  const updateServices = useCallback(async (servicesToSave: Service[]): Promise<boolean> => {
    try {
      const response = await fetch("/api/professionals/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: servicesToSave }),
      });

      if (!response.ok) throw new Error("Failed to update services");

      setServices(servicesToSave);
      toast({ title: "Success", description: "Services updated successfully" });
      return true;
    } catch (error) {
      console.error("Error updating services:", error);
      toast({
        title: "Error",
        description: "Failed to update services",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const updatePortfolio = useCallback(async (portfolioToSave: PortfolioItem[]): Promise<boolean> => {
    try {
      const response = await fetch("/api/professionals/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio: portfolioToSave }),
      });

      if (!response.ok) throw new Error("Failed to update portfolio");

      setPortfolio(portfolioToSave);
      toast({ title: "Success", description: "Portfolio updated successfully" });
      return true;
    } catch (error) {
      console.error("Error updating portfolio:", error);
      toast({
        title: "Error",
        description: "Failed to update portfolio",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const updateSkills = useCallback(async (skillsToSave: Skill[]): Promise<boolean> => {
    try {
      const response = await fetch("/api/professionals/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: skillsToSave }),
      });

      if (!response.ok) throw new Error("Failed to update skills");

      setSkills(skillsToSave);
      toast({ title: "Success", description: "Skills updated successfully" });
      return true;
    } catch (error) {
      console.error("Error updating skills:", error);
      toast({
        title: "Error",
        description: "Failed to update skills",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const updateExperience = useCallback(async (experienceToSave: WorkExperience[]): Promise<boolean> => {
    try {
      const response = await fetch("/api/professionals/experience", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workExperience: experienceToSave }),
      });

      if (!response.ok) throw new Error("Failed to update experience");

      setWorkExperience(experienceToSave);
      toast({ title: "Success", description: "Experience updated successfully" });
      return true;
    } catch (error) {
      console.error("Error updating experience:", error);
      toast({
        title: "Error",
        description: "Failed to update experience",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const updateEducation = useCallback(async (educationToSave: Education[]): Promise<boolean> => {
    try {
      const response = await fetch("/api/professionals/education", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ education: educationToSave }),
      });

      if (!response.ok) throw new Error("Failed to update education");

      setEducation(educationToSave);
      toast({ title: "Success", description: "Education updated successfully" });
      return true;
    } catch (error) {
      console.error("Error updating education:", error);
      toast({
        title: "Error",
        description: "Failed to update education",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const createProfessional = useCallback(async (name: string, professionalHeadline: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/professionals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, professionalHeadline }),
      });

      if (!response.ok) throw new Error("Failed to create professional");

      const data = await response.json();
      setProfessional(data.professional);
      toast({
        title: "Success",
        description: "Professional profile created successfully",
      });
      return true;
    } catch (error) {
      console.error("Error creating professional:", error);
      toast({
        title: "Error",
        description: "Failed to create professional profile",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  return {
    professional,
    workExperience,
    education,
    services,
    portfolio,
    skills,
    loading,
    fetchData,
    updateField,
    updateServices,
    updatePortfolio,
    updateSkills,
    updateExperience,
    updateEducation,
    createProfessional,
  };
}

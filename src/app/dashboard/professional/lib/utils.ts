import { Professional } from "../types/professional";

export const calculateProfileCompletion = (professional: Professional | null): number => {
  if (!professional) return 0;

  let completion = 0;
  const totalFields = 10;

  if (professional.name) completion++;
  if (professional.professionalHeadline) completion++;
  if (professional.aboutMe) completion++;
  if (professional.profilePicture) completion++;
  if (professional.banner) completion++;
  if (professional.location) completion++;
  if (professional.phone) completion++;
  if (professional.email) completion++;
  if (professional.website) completion++;
  if (professional.facebook || professional.twitter || professional.instagram || professional.linkedin) {
    completion++;
  }

  return Math.round((completion / totalFields) * 100);
};

export const getProfileCompletionStatus = (percentage: number): string => {
  if (percentage === 100) return "Complete";
  if (percentage >= 75) return "Almost Complete";
  if (percentage >= 50) return "Halfway There";
  if (percentage >= 25) return "Getting Started";
  return "Just Beginning";
};

export const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const skillCategories = [
  "Technical",
  "Design",
  "Business",
  "Marketing",
  "Communication",
  "Leadership",
  "Creative",
  "Analytical"
];

export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
};

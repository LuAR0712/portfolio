// Translatable copy: messages → content.education.<id>.title.

export type EducationId = "uai" | "udemyDotnet" | "sanJose" | "coderhouse" | "cecies";

export type Education = {
  id: EducationId;
  institution: string;
  year?: number;
  // Company that provided the course, shown as "via …".
  sponsor?: string;
  // Public verification link for certificates.
  credentialUrl?: string;
};

export const education: Education[] = [
  {
    id: "uai",
    institution: "Universidad Abierta Interamericana",
  },
  {
    id: "udemyDotnet",
    institution: "Udemy",
    year: 2026,
    sponsor: "CDA Informática",
    credentialUrl: "https://ude.my/UC-a1ccf3c7-4efc-46f1-ad7d-ca0291d33b02",
  },
  { id: "coderhouse", institution: "Coderhouse", year: 2023 },
  { id: "sanJose", institution: "Instituto San José A-355", year: 2017 },
  {
    id: "cecies",
    institution: "C.E.C.I.E.S. N.º 20",
  },
];

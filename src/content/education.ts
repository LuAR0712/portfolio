// Translatable copy: messages → content.education.<id>.title.

export type EducationId = "uai" | "sanJose" | "coderhouse" | "cecies";

export type Education = {
  id: EducationId;
  institution: string;
  inProgress?: boolean;
  year?: number;
};

export const education: Education[] = [
  {
    id: "uai",
    institution: "Universidad Abierta Interamericana",
    // TODO: specify which engineering degree (the title currently reads just "Ingeniería").
    inProgress: true,
  },
  { id: "coderhouse", institution: "Coderhouse", year: 2023 },
  { id: "sanJose", institution: "Instituto San José A-355", year: 2017 },
  {
    id: "cecies",
    institution: "C.E.C.I.E.S. N.º 20",
    // TODO: add the year the B2 English certificate was obtained.
  },
];

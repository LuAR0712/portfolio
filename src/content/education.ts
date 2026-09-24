// Translatable copy: messages → content.education.<id>.title.

export type EducationId = "uai" | "sanJose" | "coderhouse" | "cecies";

export type Education = {
  id: EducationId;
  institution: string;
  year?: number;
};

export const education: Education[] = [
  {
    id: "uai",
    institution: "Universidad Abierta Interamericana",
  },
  { id: "coderhouse", institution: "Coderhouse", year: 2023 },
  { id: "sanJose", institution: "Instituto San José A-355", year: 2017 },
  {
    id: "cecies",
    institution: "C.E.C.I.E.S. N.º 20",
  },
];

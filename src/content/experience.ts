import type { DateRange } from "@/lib/dates";

// Translatable copy: messages → content.experience.<id> and content.earlierExperience.<id>.

export type ExperienceId = "cda";
export type EarlierExperienceId = "danago";

export type Experience = DateRange & {
  id: ExperienceId;
  company: string;
  location: string;
};

export type EarlierExperience = DateRange & {
  id: EarlierExperienceId;
  company: string;
};

const cda: Experience = {
  id: "cda",
  company: "CDA Informática",
  location: "Buenos Aires",
  start: { year: 2022, month: 6 },
  end: null,
};

export const experience: Experience[] = [cda];

// Earlier, non-development roles: shown as a single low-emphasis line.
export const earlierExperience: EarlierExperience[] = [
  {
    id: "danago",
    company: "Danago Amoblamientos",
    start: { year: 2017 },
    end: { year: 2021 },
  },
];

// Start of the professional development career, used for "N+ years" in About.
export const careerStart = cda.start;

export type JobPosition = {
  title: string;
  companyName: string;
  startDate: string;
  endDate: string;
};

export type Education = {
  schoolName: string;
  degreeName: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
};

export type CareerVector = {
  name: string;
  headline: string;
  location: string;
  positions: JobPosition[];
  educations: Education[];
  skills: string[];
};

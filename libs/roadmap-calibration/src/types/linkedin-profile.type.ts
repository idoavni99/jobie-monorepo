export type LinkedInProfile = {
  firstName: string;
  lastName: string;
  headline: string;
  location: {
    full: string;
  };
  position: {
    title: string;
    companyName: string;
    start: {
      year: number;
    };
    end: {
      year: number;
    };
  }[];
  educations: {
    schoolName: string;
    degree: string;
    fieldOfStudy: string;
    start: {
      year: number;
    };
    end: {
      year: number;
    };
  }[];
  skills: {
    name: string;
  }[];
};

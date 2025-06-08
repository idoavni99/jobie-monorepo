export type LinkedInProfile = {
  firstName: string;
  lastName: string;
  headline: string;
  geo: {
    full: string;
    city?: string;
    country?: string;
    countryCode?: string;
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
  profilePictures?: { url: string; width: number; height: number }[];
};

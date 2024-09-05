interface Submission {
  id: number | string;
  userId: number;
  achievementId: number;
  criteriaID: number | string;
  file: string;
  point: number;
  binary: boolean; 
  description: string;
  studentComment: string;
  studentSelect: string;
}

export type { Submission };

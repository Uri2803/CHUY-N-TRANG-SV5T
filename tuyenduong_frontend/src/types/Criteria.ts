interface Criteria {
  isSubmission: boolean;
  id: string;
  file: string;
  point: number;
  binary: boolean;
  studentComment: string;
  nameCriteria: string;
  idCriteria: string;
  method: string;
  isRoot: boolean;
  isCriteria: boolean;
  evidence: boolean;
  content: string;
  note: string;
  description: string;
  result: boolean;
  soft: number;
  children: string[];
}

export default Criteria;
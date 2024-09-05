interface Criteria {
  id: number | string;
  name: string;
  method: string;
  note: string;
  content: string;
  valueListString: string;
  isCriteria: boolean;
  type: string;
  lowerSign: string;
  upperSign: string;
  soft: number;
  lowerPoint: number;
  upperPoint: number;
  evidence: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  children: Criteria[];
}
// let a: Criteria;

export type { Criteria };

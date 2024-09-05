interface User {
  id: number;
  email: string;
  isRegisteredWithGoogle?: boolean;
  role: string;
  name?: string;
  mssv?: number;
  createdAt?: Date;
  updatedAt?: Date;
  youthUnion?: string;
  isUpdatedInformation: boolean;
  surName: string;
  auditors: any[]
}

export interface UserAuditor {
  id: number;
  email: string;
  final: boolean;
}

export interface UserWithToken {
  token: string;
  user: User;
}

export default User;

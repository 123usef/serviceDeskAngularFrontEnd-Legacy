export enum UserRole {
  Admin = 0,
  Technician = 1,
  DepartmentHead = 2,
  Employee = 3
}

export interface IUser {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  departmentId: number;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: IUser;
}

export interface ITechnician {
  id: number;
  fullName: string;
  email: string;
}

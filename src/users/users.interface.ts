import { Role, SpecializationType } from '@prisma/client';

export interface UserRequest {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization?: string;
}

export interface UserSpecializationResponse {
  id: number;
  name: string;
  type: SpecializationType;
}

export interface UserResponse {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  specializationId: number | null;
  specialization: UserSpecializationResponse | null;
  role: Role;
}

export interface DoctorResponse extends UserResponse {
  speciality: string;
}

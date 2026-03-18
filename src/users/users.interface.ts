import { Role, SpecializationType } from '@prisma/client';

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

export interface DentistResponse extends UserResponse {
  specializationType: SpecializationType;
  specializationId: number;
}

import { SpecializationType } from '@prisma/client';

export interface UserSpecialization {
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
  role: string;
  specializationId: number | null;
  specialization: UserSpecialization | null;
}

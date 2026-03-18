export interface UserRequest {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  specialization?: string;
}

export interface UserResponse {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string | null;
}

export interface DoctorResponse extends UserResponse {
  speciality: string;
}

export interface UserRequest {
  name: string;
  email: string;
  password: string;
  specialization?: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  specialization: string | null;
}

export interface DoctorResponse extends UserResponse {
  speciality: string;
}

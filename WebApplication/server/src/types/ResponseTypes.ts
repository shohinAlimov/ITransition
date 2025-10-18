export interface UserResponse {
  id: number;
  name: string;
  email: string;
  status: "unverified" | "active" | "blocked";
  last_login_time: Date | null;
  registration_time: Date;
}

export interface AuthSuccessResponse {
  success: true;
  message: string;
  user: UserResponse;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

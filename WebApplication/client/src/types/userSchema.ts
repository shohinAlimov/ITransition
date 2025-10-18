export interface User {
  id: number;
  name: string;
  email: string;
  password_hashed: string;
  status: "unverified" | "active" | "blocked";
  last_login_time: Date | null;
  registration_time: Date;
}

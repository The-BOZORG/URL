export interface userDto {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

export interface userResponse {
  username: string;
  email: string;
  role: "user" | "admin";
}

export interface User {
  id?: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "admin" | "author" | "guest";
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface User {
  email: string;
  username: string;
  avatar: string;
}
export interface UpdateUserDto {
  email?: string;
  username?: string;
  avatar?: string;
  password?: string;
}

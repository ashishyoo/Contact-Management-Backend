export interface UserRegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponseDto {
  accessToken: string;
}

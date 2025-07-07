export interface ContactCreateDto {
  name: string;
  email: string;
  phone: string;
}

export interface ContactResponseDto {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  created_at: Date;
}

export class AuthResponseDto {
  token: string;
  expiresIn: number;
  user: {
    id: string,
    username: string,
  };
}

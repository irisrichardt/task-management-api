import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './auth.dto';
import { compareSync as bcryptCompareSync} from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  // eslint-disable-next-line prettier/prettier
  private jwtExpirationTimeInSeconds: number;

  constructor(
    // eslint-disable-next-line prettier/prettier
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.jwtExpirationTimeInSeconds = +this.configService.get<number>('JWT_EXPIRATION_TIME');
  }

  async signIn(username: string, password: string): Promise<AuthResponseDto> {
    const foundUser = await this.usersService.findByUserName(username);
    const isPasswordValid = bcryptCompareSync(password, foundUser.password);

    if (!isPasswordValid) {
      console.log("Senha inválida");
      throw new UnauthorizedException("Senha inválida");
    }

    if(!foundUser || !bcryptCompareSync(password, foundUser.password)) {
    console.log("encontroussss")

      throw new UnauthorizedException();
    }

    const payload = {sub: foundUser.id, username: foundUser.username};
    const token = this.jwtService.sign(payload);

    return {token, expiresIn: this.jwtExpirationTimeInSeconds}
  }
}


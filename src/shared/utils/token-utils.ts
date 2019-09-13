import { JwtService } from '@nestjs/jwt';
import { AuthDto } from '../../auth/auth.dto';
import { jwtConstants } from '../../auth/constants';

export function tokenSign(
  jwtService: JwtService,
  payload: AuthDto.JwtPayload,
): AuthDto.TokenResponse {
  return {
    accessToken: jwtService.sign(payload),
    tokenType: 'baerer',
    expiresIn: new Date(new Date().valueOf() + jwtConstants.expiresIn),
  };
}

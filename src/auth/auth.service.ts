import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as fse from 'fs-extra';
import { MulterFile } from '../files/files';
import { generatePassword, MESSAGES, uuid } from '../shared';
import { tokenSign } from '../shared/utils/token-utils';
import { UsersService } from '../users/users.service';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login({
    email,
    password,
  }: AuthDto.Login): Promise<AuthDto.TokenResponse> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Username or password is invalid.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { id } = user;

    return tokenSign(this.jwtService, { id, email });
  }

  async register(model: AuthDto.Register): Promise<AuthDto.TokenResponse> {
    const { id } = await this.usersService.create(model);

    return tokenSign(this.jwtService, { id, email: model.email });
  }
}

export async function socialLoginValidate(
  usersService: UsersService,
  jwtService: JwtService,
  authService: AuthService,
  httpService: HttpService,
  profile: any,
  done: Function,
) {
  try {
    const email = profile.emails[0].value;
    const name = profile.name.givenName + profile.name.familyName;
    const photo = ((profile.photos || [])[0] || { value: null }).value;

    if (!email) {
      done(
        null,
        new HttpException(MESSAGES.EMAIL_NOT_FOUND, HttpStatus.BAD_REQUEST),
      );
    }

    const user = await usersService.findOneByEmail(email);

    let token: AuthDto.TokenResponse;
    if (user) {
      token = tokenSign(jwtService, { id: user.id, email: user.email });
    } else {
      if (!name) {
        done(
          null,
          new HttpException(MESSAGES.NAME_NOT_FOUND, HttpStatus.BAD_REQUEST),
        );
      }

      token = await authService.register({
        email,
        name,
        password: generatePassword(),
      });
    }

    if ((!user || !user.file) && photo) {
      const file = await downloadImage(httpService, photo);
      const userId = (jwtService.decode(
        token.accessToken,
      ) as AuthDto.JwtPayload).id;
      await usersService.uploadAvatar((file as any) as MulterFile, userId);
    }

    done(null, token);
  } catch (err) {
    throw new HttpException(MESSAGES.AN_ERROR_OCCURRED, HttpStatus.BAD_REQUEST);
  }
}

async function downloadImage(
  httpService: HttpService,
  photo: string,
): Promise<Partial<MulterFile>> {
  const date = new Date().valueOf();
  const writer = fse.createWriteStream(`./uploads/${date}.jpeg`);

  if (photo.indexOf('=s50')) {
    photo = photo.replace('=s50', '');
  }

  if (photo.indexOf('/s50')) {
    photo = photo.replace('/s50', '');
  }

  const response = await httpService.axiosRef({
    url: photo,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      resolve({
        destination: './uploads/',
        filename: `${date}.jpeg`,
        originalname: uuid(),
        size: 0,
      });
    });
    writer.on('error', reject);
  });
}

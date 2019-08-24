import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';

export function tokenSign(id: string, email: string) {
  return jwt.sign({ id, email }, process.env.SECRET, {
    expiresIn: '1d',
  });
}

export async function tokenVerify(token: string) {
  try {
    const decoded: any = await jwt.verify(token, process.env.SECRET);
    return decoded;
  } catch (err) {
    const message = 'Token error: ' + (err.message || err.name);
    throw new HttpException(message, HttpStatus.UNAUTHORIZED);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fse from 'fs-extra';
import * as multer from 'multer';
import * as path from 'path';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { MulterFile } from '../files/files';
import { CommonValidators, MESSAGES } from '../shared';
import { UsersDto } from './users.dto';
import { UsersService } from './users.service';

const MULTER_STORAGE = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  findMe(@Headers('authorization') accessToken: string) {
    return this.userService.findMe(accessToken);
  }

  @Post()
  @Roles('admin')
  create(@Body() model: UsersDto.Create) {
    return this.userService.create(model);
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', { fileFilter, storage: MULTER_STORAGE }),
  )
  uploadFile(
    @UploadedFile() avatar,
    @Headers('authorization') accessToken: string,
  ) {
    return this.userService.uploadAvatar(avatar, accessToken);
  }

  @Get('avatar/:img')
  async sendUploadedImage(@Param('img') img: string, @Res() res: Response) {
    try {
      const image = await fse.readFile(`uploads/${img}`, 'binary');
      res.set({
        'Content-Type': `image/${path.extname(img).replace('.', '')}`,
      });
      res.write(image, 'binary');
      res.end();
    } catch (error) {
      throw new HttpException(MESSAGES.IMAGE_NOT_FOUND, 412);
    }
  }

  @Delete('avatar')
  async deleteAvatar(@Headers('authorization') accessToken: string) {
    return this.userService.deleteAvatar(accessToken);
  }

  @Get(':id')
  findOne(@Param() { id }: CommonValidators.IdParamValidator) {
    return this.userService.findById(id);
  }

  @Put(':id')
  @Roles('admin')
  update(
    @Param() { id }: CommonValidators.IdParamValidator,
    @Body() model: UsersDto.Update,
  ) {
    return this.userService.update(id, model);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param() { id }: CommonValidators.IdParamValidator) {
    return this.userService.delete(id);
  }
}

function fileFilter(req, file: MulterFile, callback) {
  const ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    return callback(new HttpException(MESSAGES.ONLY_IMAGE_ALLOWED, 412), false);
  }

  callback(null, true);
}

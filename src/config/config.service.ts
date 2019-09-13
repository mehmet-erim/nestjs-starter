import * as dotenv from 'dotenv';
import * as fse from 'fs-extra';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fse.readFileSync(`${filePath}`));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}

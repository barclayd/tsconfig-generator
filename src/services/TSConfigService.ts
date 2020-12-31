import { Framework } from '@/types';
import { copyFileSync } from 'fs';
import { pathForFolder } from '@/index';

export class TSConfigService {
  constructor(private framework: Framework) {}

  private async pathToFrameworkTSConfig(): Promise<string> {
    const templatesPath = pathForFolder('templates');
    return `${templatesPath}/${this.framework.toLowerCase()}-tsconfig.json`;
  }

  public async create() {
    if (this.framework === Framework.Npx) {
      return;
    }
    const tsconfigPath = await this.pathToFrameworkTSConfig();
    copyFileSync(tsconfigPath, process.cwd() + '/tsconfig.json');
  }
}

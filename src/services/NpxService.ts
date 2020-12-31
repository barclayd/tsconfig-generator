import { OldPackageJson, PackageAnswer, PackageJson } from '@/types';
import {
  generatePackageJson,
  isPackageJsonPresent,
  loadFile,
  pathForFolder,
} from '@/helpers';
import * as inquirer from 'inquirer';
import { writeFileSync } from 'fs';
import { ScriptService } from '@/services/ScriptService';

export class NpxService {
  private devDependenciesMap = new Map<string, boolean>([
    ['@types/node', true],
    ['@typescript-eslint/eslint-plugin', true],
    ['@typescript-eslint/parser', true],
    ['eslint', true],
    ['eslint-config-prettier', true],
    ['eslint-plugin-prettier', true],
    ['prettier', true],
    ['typescript', true],
  ]);

  private REMOVE_OLD_PACKAGE_JSON = `rm -rf ${process.cwd()}/temp/old-package.json`;
  private COPY_FILE_STRUCTURE_INTO_WORKING_DIR = (templatesPath: string) =>
    `cp -r ${templatesPath}/npx ./temp`;
  private DELETE_NON_RELEVANT_LINES_FROM_POST_BUILD = `sed -i '' -e '3,6d' ./temp/scripts/postBuild.sh`;
  private NPM_INSTALL = 'npm i';

  constructor() {}

  private pruneDevDependencies = (devDependencies: {
    [key: string]: string;
  }) => {
    return Object.keys(devDependencies).reduce((acc, devDependency) => {
      if (this.devDependenciesMap.get(devDependency)) {
        acc = {
          ...acc,
          [devDependency]: devDependencies[devDependency],
        };
      }
      return acc;
    }, {});
  };

  private async createPackageJson({ name, description }: PackageJson) {
    const {
      scripts,
      bin,
      main,
      devDependencies,
    } = await loadFile<OldPackageJson>('temp/old-package.json');
    const prunedDevDependencies = this.pruneDevDependencies(devDependencies);
    const newPackageJson = {
      name: name.toLowerCase(),
      description,
      version: '0.1.0',
      main,
      bin,
      scripts,
      devDependencies: prunedDevDependencies,
    };
    await writeFileSync(
      `${process.cwd()}/temp/package.json`,
      JSON.stringify(newPackageJson, null, 2),
    );
    ScriptService.run(this.REMOVE_OLD_PACKAGE_JSON);
  }

  public async run() {
    const templatesPath = pathForFolder('templates');
    ScriptService.run(this.COPY_FILE_STRUCTURE_INTO_WORKING_DIR(templatesPath));
    ScriptService.runSilent(this.DELETE_NON_RELEVANT_LINES_FROM_POST_BUILD);
    if (!isPackageJsonPresent()) {
      generatePackageJson();
    }
    const packageJson = await loadFile<PackageJson>('package.json');
    const packageJsonAnswers = await inquirer.prompt<PackageAnswer>([
      {
        type: 'input',
        message: 'Package name',
        name: 'name',
        default: () => packageJson.name,
      },
      {
        type: 'input',
        message: 'Package description',
        name: 'description',
        default: () => packageJson.description,
      },
    ]);
    await this.createPackageJson(packageJsonAnswers);
    ScriptService.run(this.NPM_INSTALL);
  }
}

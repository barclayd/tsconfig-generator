import { OldPackageJson, PackageAnswer, PackageJson } from '@/types';
import { generatePackageJson, isPackageJsonPresent, loadFile } from '@/helpers';
import inquirer from 'inquirer';
import { writeFileSync } from 'fs';
import { ScriptService } from '@/services/ScriptService';
import { pathForFolder } from '@/index';

export class NPXService {
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

  private REMOVE_OLD_PACKAGE_JSON = `rm -rf ${process.cwd()}/${
    this.path
  }old-package.json`;
  private COPY_NPX_SETUP_INTO_WORKING_DIR = (templatesPath: string) =>
    this.isDebug
      ? `cp -r ${templatesPath}/npx/. ./temp`
      : `cp -r ${templatesPath}/npx/. .`;
  private DELETE_NON_RELEVANT_LINES_FROM_POST_BUILD = `sed -i '' -e '3,8d' ./${this.path}scripts/postBuild.sh`;
  private RENAME_GITIGNORE_TO_DOT_GITIGNORE = 'mv gitignore .gitignore';
  private NPM_INSTALL = 'npm i';

  constructor(private isDebug = process.env.DEBUG === 'true') {}

  get path() {
    const path = this.isDebug ? 'temp/' : '';
    return `${path}${this.additionalSlash}`;
  }

  get additionalSlash() {
    return this.isDebug ? '/' : '';
  }

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
    } = await loadFile<OldPackageJson>(`${this.path}old-package.json`);
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
      `${process.cwd()}/${this.path}package.json`,
      JSON.stringify(newPackageJson, null, 2),
    );
    ScriptService.run(this.REMOVE_OLD_PACKAGE_JSON);
  }

  public async run() {
    const templatesPath = pathForFolder('templates');
    ScriptService.run(this.COPY_NPX_SETUP_INTO_WORKING_DIR(templatesPath));
    ScriptService.runSilent(this.DELETE_NON_RELEVANT_LINES_FROM_POST_BUILD);
    ScriptService.run(this.RENAME_GITIGNORE_TO_DOT_GITIGNORE);
    if (!isPackageJsonPresent(false)) {
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

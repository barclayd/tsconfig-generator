#!/usr/bin/env node
import { copyFileSync, readdirSync, writeFileSync } from 'fs';
import {
  FrameworkAnswer,
  Framework,
  PackageJson,
  PackageAnswer,
  OldPackageJson,
} from './types';
import shell from 'shelljs';
import * as inquirer from 'inquirer';
import path from 'path';

const setupScriptMap = new Map<Framework, string>([
  [Framework.Node, 'node.sh'],
]);

const npxDevDependenciesMap = new Map<string, boolean>([
  ['@types/node', true],
  ['@typescript-eslint/eslint-plugin', true],
  ['@typescript-eslint/parser', true],
  ['eslint', true],
  ['eslint-config-prettier', true],
  ['eslint-plugin-prettier', true],
  ['prettier', true],
  ['typescript', true],
]);

const pathForFolder = (folder: string) => path.resolve(__dirname, folder);

const pathToFrameworkTSConfig = async (
  framework: Framework,
): Promise<string> => {
  const templatesPath = pathForFolder('templates');
  return `${templatesPath}/${framework.toLowerCase()}-tsconfig.json`;
};

const writeTSConfig = async (framework: Framework) => {
  if (framework === Framework.Npx) {
    return;
  }
  const cwd = process.cwd();
  const tsconfigPath = await pathToFrameworkTSConfig(framework);
  copyFileSync(tsconfigPath, cwd + '/tsconfig.json');
};

const additionalSetup = (framework: Framework) => {
  const setupScript = setupScriptMap.get(framework);
  if (!setupScript) {
    return;
  }
  const scriptsPath = pathForFolder('scripts');
  shell.exec(`${scriptsPath}/${setupScript}`);
};

const loadFile = async <T>(file: string): Promise<T> => {
  try {
    return await import(`${process.cwd()}/${file}`);
  } catch (error) {
    throw new Error(`Failed to load file, error: ${error}`);
  }
};

const pruneDevDependencies = (devDependencies: { [key: string]: string }) => {
  return Object.keys(devDependencies).reduce((acc, devDependency) => {
    if (npxDevDependenciesMap.get(devDependency)) {
      acc = {
        ...acc,
        [devDependency]: devDependencies[devDependency],
      };
    }
    return acc;
  }, {});
};

const configureNpxPackageJson = async ({ name, description }: PackageJson) => {
  const {
    scripts,
    bin,
    main,
    devDependencies,
  } = await loadFile<OldPackageJson>('temp/old-package.json');
  const prunedDevDependencies = pruneDevDependencies(devDependencies);
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
  shell.exec(`rm -rf ${process.cwd()}/temp/old-package.json`);
};

const npxSetup = async (framework: Framework) => {
  if (framework !== Framework.Npx) {
    return;
  }
  const templatesPath = pathForFolder('templates');
  shell.exec(`cp -r ${templatesPath}/npx ./temp`);
  shell.exec(silentScript(`sed -i '' -e '3,6d' ./temp/scripts/postBuild.sh`));
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
  await configureNpxPackageJson(packageJsonAnswers);
  shell.exec('npm i');
};

const isPackageJsonPresent = (temp = false) =>
  readdirSync(`${process.cwd()}/${temp ? 'temp' : ''}`).includes(
    'package.json',
  );

const silentScript = (script: string) => `: $(${script})`;

const generatePackageJson = () => {
  shell.exec(silentScript('npm init -y'));
};

(async () => {
  try {
    if (!isPackageJsonPresent()) {
      generatePackageJson();
    }
    const { framework } = await inquirer.prompt<FrameworkAnswer>([
      {
        type: 'list',
        message: 'Pick the framework you are using:',
        name: 'framework',
        choices: Object.values(Framework),
      },
    ]);
    await writeTSConfig(framework);
    additionalSetup(framework);
    await npxSetup(framework);
  } catch (error) {
    console.log(`Error occurred: ${error}`);
  }
})();

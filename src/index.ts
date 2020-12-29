#!/usr/bin/env node
import { copyFileSync, readdirSync } from 'fs';
import { Answer, Framework } from './types';
import shell from 'shelljs';
import * as inquirer from 'inquirer';
import path from 'path';

const setupScriptMap = new Map<Framework, string>([
  [Framework.Node, 'node.sh'],
]);

const pathForFolder = (folder: string) => path.resolve(__dirname, folder);

const pathToFrameworkTSConfig = async (
  framework: Framework,
): Promise<string> => {
  const templatesPath = pathForFolder('templates');
  return `${templatesPath}/${framework.toLowerCase()}-tsconfig.json`;
};

const writeTSConfig = async (framework: Framework) => {
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

const isPackageJsonPresent = () =>
  readdirSync(process.cwd()).includes('package.json');

const silentScript = (script: string) => `: $(${script})`;

const generatePackageJson = () => {
  shell.exec(silentScript('npm init -y'));
};

(async () => {
  try {
    if (!isPackageJsonPresent()) {
      generatePackageJson();
    }
    isPackageJsonPresent();
    const { framework }: Answer = await inquirer.prompt([
      {
        type: 'list',
        message: 'Pick the framework you are using:',
        name: 'framework',
        choices: Object.values(Framework),
      },
    ]);
    await writeTSConfig(framework);
    additionalSetup(framework);
  } catch (error) {
    console.log(`Error occurred: ${error}`);
  }
})();

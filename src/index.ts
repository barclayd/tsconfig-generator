import { copyFileSync } from 'fs';
import { Answer, Framework } from './types';
import shell from 'shelljs';
import * as inquirer from 'inquirer';

const setupScriptMap = new Map<Framework, string>([
  [Framework.Node, './scripts/node.sh'],
]);

const pathToFrameworkTSConfig = async (
  framework: Framework,
): Promise<string> => {
  return `./src/templates/${framework.toLowerCase()}-tsconfig.json`;
};

const writeTSConfig = async (framework: Framework) => {
  const cwd = process.cwd();
  const tsconfigPath = await pathToFrameworkTSConfig(framework);
  copyFileSync(tsconfigPath, cwd + `/tsconfig.json`);
};

const additionalSetup = (framework: Framework) => {
  const setupScript = setupScriptMap.get(framework);
  if (!setupScript) {
    return;
  }
  shell.exec(setupScript);
};

(async () => {
  try {
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

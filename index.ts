import { copyFileSync } from 'fs';

const inquirer = require('inquirer');

enum Framework {
  React = 'React',
  Next = 'Next',
  Node = 'Node',
  Electron = 'Electron',
}

interface Answer {
  framework: Framework;
}

const FILENAME = 'tsconfig.json';

const pathToFrameworkTSConfig = async (
  framework: Framework,
): Promise<string> => {
  return `./templates/${framework.toLowerCase()}-tsconfig.json`;
};

const writeTSConfig = async (framework: Framework) => {
  const cwd = process.cwd();
  const tsconfigPath = await pathToFrameworkTSConfig(framework);
  copyFileSync(tsconfigPath, cwd + `/${FILENAME}`);
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
  } catch (error) {
    console.log(`Error occurred: ${error}`);
  }
})();

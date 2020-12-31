#!/usr/bin/env node
import moduleAlias from 'module-alias';
if (process.env.NODE_ENV === 'production') {
  moduleAlias();
}
import { FrameworkAnswer, Framework } from './types';
import { isPackageJsonPresent, generatePackageJson } from './helpers';
import * as inquirer from 'inquirer';
import { TSConfigService } from '@/services/TSConfigService';
import { ScriptSetupService } from '@/services/ScriptSetupService';
import { NpxService } from '@/services/NpxService';
import path from 'path';

export const pathForFolder = (folder: string) =>
  path.resolve(__dirname, folder);

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
    await new TSConfigService(framework).create();
    await new ScriptSetupService(framework).execute();
    if (framework === Framework.Npx) {
      await new NpxService().run();
    }
  } catch (error) {
    console.log(`Error occurred: ${error}`);
  }
})();

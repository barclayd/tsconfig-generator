import { readdirSync } from 'fs';
import { ScriptService } from '@/services/ScriptService';

export const loadFile = async <T>(file: string): Promise<T> => {
  try {
    return await import(`${process.cwd()}/${file}`);
  } catch (error) {
    throw new Error(`Failed to load file, error: ${error}`);
  }
};

export const isPackageJsonPresent = (temp = false) =>
  readdirSync(`${process.cwd()}/${temp ? 'temp' : ''}`).includes(
    'package.json',
  );

const NPM_INIT = 'npm init -y';

export const generatePackageJson = () => {
  ScriptService.runSilent(NPM_INIT);
};

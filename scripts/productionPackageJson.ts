import { writeFileSync } from 'fs';
import {
  name,
  version,
  description,
  author,
  main,
  bin,
  scripts,
  dependencies,
  bugs,
  homepage,
  license,
  keywords,
} from '../package.json';

const pruneScripts = () => {
  const { start } = scripts;
  return {
    start,
  };
};

const productionPackageJson = {
  name,
  version,
  description,
  main,
  bin,
  scripts: pruneScripts(),
  keywords,
  author,
  homepage,
  bugs,
  license,
  dependencies,
};

(async () => {
  const distDir = `${process.cwd()}/dist/package.json`;
  await writeFileSync(distDir, JSON.stringify(productionPackageJson));
})();

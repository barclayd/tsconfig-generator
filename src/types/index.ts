export enum Framework {
  React = 'React',
  Next = 'Next',
  Node = 'Node',
  Electron = 'Electron',
  Npx = 'Npx',
}

export interface FrameworkAnswer {
  framework: Framework;
}

export type PackageAnswer = PackageJson;

export interface PackageJson {
  name: string;
  description: string;
}

export interface OldPackageJson extends PackageJson {
  version: string;
  main: string;
  bin: string;
  scripts: { [key: string]: string };
  devDependencies: { [key: string]: string };
}

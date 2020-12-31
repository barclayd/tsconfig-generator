import shell from 'shelljs';

export class ScriptService {
  static run(script: string) {
    shell.exec(script);
  }

  static runSilent(script: string) {
    shell.exec(script, {
      silent: true,
    });
  }
}

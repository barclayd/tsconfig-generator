import { Framework } from '@/types';
import { ScriptService } from '@/services/ScriptService';
import { pathForFolder } from '@/index';

export class ScriptSetupService {
  private setupScriptMap = new Map<Framework, string>([
    [Framework.Node, 'node.sh'],
  ]);

  constructor(private framework: Framework) {}

  public execute() {
    const setupScript = this.setupScriptMap.get(this.framework);
    if (!setupScript) {
      return;
    }
    const scriptsPath = pathForFolder('scripts');
    ScriptService.run(`${scriptsPath}/${setupScript}`);
  }
}

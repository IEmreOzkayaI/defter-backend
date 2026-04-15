import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { ERROR_DEFINITIONS } from '../../configs/error-definitions.config';
import { throwInternalServerException } from '../../utils/error.util';

const TOKEN_ORG_SCOPE = '@token-org/';

@Injectable()
export class VersionService {
  findVersion() {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const dependencies = this.getTokenOrgDependencies(packageJson);
      return {
        version: packageJson.version,
        name: packageJson.name,
        dependencies,
      };
    } else {
      return throwInternalServerException(ERROR_DEFINITIONS.PACKAGE_JSON_NOT_FOUND.reason);
    }
  }

  private getTokenOrgDependencies(packageJson: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> }): Record<string, string> {
    const out: Record<string, string> = {};
    const merge = (deps: Record<string, string> | undefined) => {
      if (!deps) return;
      for (const [name, version] of Object.entries(deps)) {
        if (name.startsWith(TOKEN_ORG_SCOPE)) {
          const shortName = name.slice(TOKEN_ORG_SCOPE.length);
          out[shortName] = version;
        }
      }
    };
    merge(packageJson.dependencies);
    merge(packageJson.devDependencies);
    return out;
  }
}

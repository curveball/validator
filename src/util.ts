import * as fs from 'fs';
import { SchemaInfo } from './types';

export function findSchemas(path: string, localPrefix: string = ''): SchemaInfo[] {
  const schemas: SchemaInfo[] = [];
  const files = fs.readdirSync(path);
  for (const file of files) {
    const fullPath = path + '/' + file;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      schemas.push(...findSchemas(fullPath, localPrefix + file + '/'));
    } else {
      const parsed = JSON.parse(fs.readFileSync(fullPath,'utf-8'));
      schemas.push({
        id: parsed.$id,
        description: parsed.description,
        path: localPrefix + file,
        schema: parsed,
      });
    }
  }
  return schemas;
}

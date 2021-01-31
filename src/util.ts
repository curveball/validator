import * as fs from 'fs';
import { UnprocessableEntity } from '@curveball/http-errors';
import Ajv2019 from 'ajv/dist/2019';
import betterAjvErrors from 'better-ajv-errors';
import addFormats from 'ajv-formats';
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

const ajv = new Ajv2019();
addFormats(ajv);

export function addSchemasForDir(path: string): void {
  const schemas = findSchemas(path);
  for (const schema of schemas) {
    // eslint-disable-next-line no-console
    console.log('Loading schema ' + schema.id);
    ajv.addSchema(schema.schema);
  }
}

export function schemaValidate<T>(input: any, schema: string): T {
  const result = ajv.validate(schema, input);
  if (result) {
    return input;
  }

  const error = ajv.errors;
  const output = betterAjvErrors(schema, input, error, {format: 'js'});
  if (!output) {
    throw new Error('Unknown schema validation error');
  }

  // eslint-disable-next-line no-console
  console.log(output);
  throw new UnprocessableEntity(`JSON-Schema validation failed. ${output[0].error}`);
}

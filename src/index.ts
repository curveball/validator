import { UnprocessableEntity } from '@curveball/http-errors';
import * as Ajv from 'ajv';
import * as betterAjvErrors from 'better-ajv-errors';
import * as fs from 'fs';

const ajv = new Ajv({ jsonPointers: true });
const schemas: string[] = [];

export function addSchemasForDir(path: string) {
  const files = fs.readdirSync(path);
  for (const file of files) {
    const fullPath = path + '/' + file;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addSchemasForDir(fullPath);
    } else {
      schemas.push(fullPath);
    }
  }
}

for (const schema of schemas) {

  const parsed = JSON.parse(fs.readFileSync(schema, 'utf-8'));
  // eslint-disable-next-line no-console
  console.log('Loading schema ' + parsed['$id']);
  ajv.addSchema(parsed);

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

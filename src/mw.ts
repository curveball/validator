import { Middleware } from '@curveball/core';
import Ajv2019 from 'ajv/dist/2019';
import addFormats from 'ajv-formats';
import { findSchemas } from './util';
import betterAjvErrors from 'better-ajv-errors';
import { UnprocessableEntity } from '@curveball/http-errors';
import { SchemaCollectionController, SchemaController } from './controllers';

export default function(schemaPath: string): Middleware {

  const ajv = new Ajv2019();
  addFormats(ajv);

  const schemas = findSchemas(schemaPath);
  for (const schema of schemas) {
    // eslint-disable-next-line no-console
    console.log('📐 Loading schema ' + schema.id);
    ajv.addSchema(schema.schema);
  }

  const schemaCollectionController = new SchemaCollectionController(schemas);
  const schemaController = new SchemaController(schemas);

  return async (ctx, next) => {

    ctx.request.validate = (schemaId: string) => {
      const result = ajv.validate(schemaId, ctx.request.body);
      if (result) {
        return;
      }

      const error = ajv.errors;
      const output = betterAjvErrors(schemaId, ctx.request.body, error, {format: 'js'});
      if (!output) {
        throw new Error('Unknown schema validation error');
      }

      // eslint-disable-next-line no-console
      console.log(output);
      throw new UnprocessableEntity(`JSON-Schema validation failed. ${output[0].error}`);
    };

    if (ctx.path === '/') {
      // If we're on the home document, add a link to the
      // schema collection.
      ctx.response.links.add({
        rel: 'schema-collection',
        href:'/schema',
        title: 'JSON Schema definitions',
      });
    }

    if (ctx.request.path === '/schema') {
      return schemaCollectionController.dispatch(ctx);
      return;
    }
    if (ctx.request.path.startsWith('/schema/')) {
      return schemaController.dispatch(ctx);
    }

    await next();

  };

}

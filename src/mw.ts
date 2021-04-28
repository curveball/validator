import { Middleware } from '@curveball/core';
import Ajv2019 from 'ajv/dist/2019';
import addFormats from 'ajv-formats';
import { findSchemas } from './util';
import * as betterAjvErrors from 'better-ajv-errors';
import { UnprocessableEntity } from '@curveball/http-errors';
import { SchemaCollectionController, SchemaController } from './controllers';

type Options = {
  /**
   * Path to schema directory.
   *
   * The validator will recursively scan and parse every file in this directory
   */
  schemaPath: string;

  /**
   * By default the middleware will create a `Link` on the "/" route to point
   * to a collection of schemas.
   *
   * If this is turned off, that link will not be added.
   */
  noLink?: boolean;
}


export default function(options: string|Options): Middleware {

  const ajv = new Ajv2019();
  addFormats(ajv);

  const trueOptions: Options = typeof options === 'string' ? { schemaPath: options }: options;
  const schemas = findSchemas(trueOptions.schemaPath);
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

    if (ctx.request.path === '/schema') {
      return schemaCollectionController.dispatch(ctx);
      return;
    }
    if (ctx.request.path.startsWith('/schema/')) {
      return schemaController.dispatch(ctx);
    }

    await next();

    if (!trueOptions.noLink && ctx.path === '/') {
      // If we're on the home document, add a link to the
      // schema collection.
      ctx.response.links.add({
        rel: 'schema-collection',
        href:'/schema',
        title: 'JSON Schema definitions',
      });
    }

  };

}

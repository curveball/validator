import { Controller } from '@curveball/controller';
import { Context } from '@curveball/kernel';
import { SchemaInfo } from './types';
import { NotFound } from '@curveball/http-errors';

export class SchemaCollectionController extends Controller {

  constructor(private schemas: SchemaInfo[]) {
    super();
  }

  get(ctx: Context) {
    ctx.response.type = 'application/hal+json';

    ctx.response.body = {
      _links: {
        self: { href: '/schema', title: 'JSON Schema definitions'},
        item: this.schemas.map(schema => {
          return {
            href: '/schema/' + schema.path,
            title: schema.description,
          };
        }),
      }
    };

  }

}

export class SchemaController extends Controller {

  constructor(private schemas: SchemaInfo[]) {
    super();
  }


  get(ctx: Context) {

    const schemaLocalPath = ctx.path.substr('/schema/'.length);
    const schema = this.schemas.find(schema => schema.path === schemaLocalPath);
    if (!schema) {
      throw new NotFound('Could not find a schema with this id');
    }

    ctx.response.type = 'application/schema+json';

    ctx.response.links.add({
      rel: 'collection',
      href: '/schema',
      title: 'JSON Schema definitions',
    });

    ctx.response.body = schema.schema;

  }

}

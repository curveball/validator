Curveball Validator 
===================

This package provides validation features based on json-schema.

This can be used to validate incoming JSON bodies, but can alternatively
also be used to validate any data from `ctx.request.body`, this means it
will work with form data just fine too.

In addition it will also create a new route `/schemas`, which is a collection
where API clients can find all JSON schemas, so they may be re-used
by clients.


Installation
------------

    npm install @curveball/validation


Getting started
---------------

To get started, write a JSON schema to validate input. For example:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://my-api.example.com/schemas/article.json",
  "title": "Article",
  "type": "object",
  
  "requiredProperties": ["title", "body"],
  "additionalProperties": false,

  "properties": {
    "title": { "type": "string" },
    "body": { "type": "string" }
  }

}
```

For best results, we recommend using a full URI in `$id`. The domain
should be your production API domain.

This allows the validator middleware to actually serve the schemas
hosted on `/schema/[schemaname.json]`, making things auto-documented.

After you created a schema file, and placed them in a directory, add
the middleware:


```typescript
import { Application } from '@curveball/core';
import validator from '@curveball/validator';

const app = new Application();
app.use(validator(
  // Provide path to your schema directory
  __dirname + '/schemas/'
));


app.use(
  route('/article').post(ctx => {

    // Will throw an error if validation failed
    ctx.request.validate('https://my-api.example.com/schemas/article.json');


  })
);
```

### Types for request body.

You might automatically convert your JSON Schema files to typescript
types with tools such as [json-schema-to-typescript][1].

If true, you can specify the type of the request body while validating:

```typescript
app.use(
  route('/article').post(ctx => {

    ctx.request.validate<Article>('https://my-api.example.com/schemas/article.json');
    // ctx.request.body is now typed Article

  })
);
```

By default `ctx.request.body` is typed `unknown`, but calling Validator with
a Type pararameter will 'assert it' as that type if validation is successful.

[1]: https://www.npmjs.com/package/json-schema-to-typescript

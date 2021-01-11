Badgateway Schema Validation for API
====================================

Purpose of this package is to validate and declare JSON-schema.

Installation
------------

    npm install @badgateway/schema-api


Getting started
---------------

There are 2 main functions in this package.

`addSchemasForDir` & `schemaValidate`
addSchemasForDir

To add the existing JSON-schema, you'll have to:
`import { addSchemasForDir } from @badgateway/schema-api`;
then
call `addSchemasForDir(__dirname + [path of your JSON-schema]);`

To use the `schemaValidate`, first import
`import { schemaValidate } from @badgateway/schema-api`;
then could do something like this
```
  const halService = validate<HalService>(
    ctx.request.body,
    'https://api.foo.com/schema/service.json'
  );
```

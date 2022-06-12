import { Application, Context } from '@curveball/core';
import validator from '../src';
import { expect } from 'chai';
import bodyParser from '@curveball/bodyparser';

describe('Validator middleware', () => {

  it('should create properties on Context', async () => {

    const app = getApp();

    let result = false;

    app.use( ctx => {

      ctx.response.body = 'ok';
      expect(ctx.schemas).to.be.an('Array');
      expect(ctx.ajv).to.be.an('Object');
      expect(ctx.request.validate).to.be.a('Function');
      result = true;

    });

    await app.subRequest(
      'GET',
      '/',
    );

    expect(result).to.equal(true);

  });

  it('should emit a 422 if validation failed', async () => {

    const app = getApp();
    app.use( (ctx: Context) => {
      ctx.request.validate('http://example/schema/article.json');
    });

    const response = await app.subRequest(
      'POST',
      '/',
      {'Content-Type': 'application/json'},
      '{"title-typo": "foo"}'
    );

    expect(response.status).to.equal(422);

  });

});

function getApp() {
  const app = new Application();
  app.use(bodyParser());
  app.use(validator({
    schemaPath: __dirname + '/schemas',
    quiet: true,
  }));
  return app;

}

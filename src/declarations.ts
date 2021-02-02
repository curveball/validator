import '@curveball/core';

declare module '@curveball/core' {

  interface Request {
    validate: <T>(schemaId: string) => asserts this is Request<T>;
  }

}

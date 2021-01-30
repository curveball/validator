import { Context } from '@curveball/core';
import '@curveball/core';

declare module '@curveball/core' {

  interface Request {
    validate: <T>(schemaId: string) => asserts this is Context<T>;
  }

}

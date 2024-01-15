import '@curveball/kernel';
import Ajv from 'ajv/dist/2019.js';
import { SchemaInfo } from './types.js';

declare module '@curveball/kernel' {

  interface Request {

    /**
     * Validate the request body against a JSON schema.
     */
    validate: <T>(schemaId: string) => asserts this is Request<T>;

  }

  interface Context {

    /**
     * List of JSON schemas
     */
    schemas: SchemaInfo[];

    /**
     * AJV instance.
     *
     * This has all the loaded schemas precompiled.
     */
    ajv: Ajv.default;

  }

}

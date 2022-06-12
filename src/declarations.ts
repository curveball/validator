import '@curveball/core';
import Ajv from 'ajv';
import { SchemaInfo } from './types';

declare module '@curveball/core' {

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
    ajv: Ajv;

  }

}

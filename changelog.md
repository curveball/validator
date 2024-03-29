Changelog
=========

1.0.0 (2024-01-15)
------------------

* Finally! Curveball v1. Only took 6 years.
* CommonJS support has been dropped. The previous version of this library
  supported both CommonJS and ESM. The effort of this no longer feels worth it.
  ESM is the future, so we're dropping CommonJS.
* Now requires Node 18.
* Upgraded to Typescript 5.3.


0.11.0 (2023-02-15)
-------------------

* This package now supports ESM and CommonJS modules.
* No longer supports Node 14. Please use Node 16 or higher.


0.10.0 (2022-09-03)
-------------------

* Upgraded from `@curveball/core` to `@curveball/kernel`.


0.9.0 (2022-06-11)
------------------

* The plugin now creates a `.schemas` and `.ajv` properties on `Context`, to
  make it easy to access the ajv instance from other contexts.


0.8.4 (2022-03-14)
------------------

* Add a `quiet` setting to suppress all logging. (@defrex)


0.8.3 (2022-01-15)
------------------

* Update all dependencies, fixing a potential upstream security bug in
  `json-pointer`.


0.8.2 (2021-05-28)
------------------

* Switch from `better-ajv-errors` to `@stoplight/better-ajv-errors`. The former
  no longer appears to be maintained.


0.8.1 (2021-05-18)
------------------

* Add an option to *not* automatically add a HTTP Link header.


0.8.0 (2021-02-15)
------------------

* Now an official Curveball package.
* Renamed from `@badgateway/schema-api` to `@curveball/validator`.
* Remove stateful API (`addSchemasForDir`, `schemaValidate` functions).


0.6.1 (2021-02-01)
------------------

* Fix validation method.


0.6.0 (2021-01-31)
------------------

* Rewrote parts of the library to behave more like a middleware. The validator
  can now be found in `ctx.request.validate()`.
* The middleware automatically creates a 'schema collection', mounted under
  `/schema`, and also creates a link from the home document for easy discovery.


0.5.0 (2021-01-31)
------------------

* Validator can now run more than once.


0.4.0 (2021-01-14)
------------------

* Include 'ajv-formats'.


0.3.0 (2021-01-14)
------------------

* Switch to JSON-Schema 2019-09 draft.


0.2.0 (2021-01-14)
------------------

* Upgrade to Ajv 7


0.1.0 (2021-01-14)
------------------

* Bug: Validation didn't work.


0.0.3 (2021-01-14)
------------------

* Re-release of 0.0.2.


0.0.2 (2021-01-14)
------------------

* First version

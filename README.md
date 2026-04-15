# TokenX Energy Basket Service

NestJS service that manages the **basket lifecycle** at energy stations (create, lock, pay, complete). Station clients (POS, pumps, displays, etc.) call versioned APIs such as **device**; every request is scoped by **organisation** headers in a multi-tenant setup.

## Contents

- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Device API](#device-api)
- [Error handling](#error-handling)
- [Testing](#testing)
- [MongoDB](#mongodb)
- [Links](#links)

## Getting started

| Step | Command |
| --- | --- |
| Install | `pnpm install` |
| Run (dev) | `pnpm run start:dev` |
| Build | `pnpm run build` |
| Lint | `pnpm run lint` |
| Integration tests | `pnpm run test:integration` |
| Coverage | `pnpm run test:integration:cov` |

**Device endpoints** require: `x-fiscal-id`, `x-branch-id`, `x-merchant-id`, `x-distribution-company-id`.

Copy and adjust `.env` for local runs. Mongo-related variables are described under [MongoDB](#mongodb).

## Project structure

| Path | Role |
| --- | --- |
| `src/common/` | Global filter, interceptor, env/error config, organisation decorators, validators |
| `src/modules/internal/basket/` | Domain: `common/`, `v1/` (API version), device submodule (controller, service, repository, `dto/`) |
| `src/modules/internal/basket/v1/` | Shared basket repository and service (not device-only) |
| `src/modules/shared/` | **database/** (Mongoose, entities, transactions), **version/** |
| `src/main.ts` | Bootstrap: validation pipe, filters, interceptor, URI versioning (`v1`) |

**Device client** (`v1/device/`): `device.controller` → `device.service` → `device.repository`; shared basket logic may be reused from `v1/`.

## Device API

Base path: `v1/device/baskets` — **BasketDeviceControllerV1**

| Method | Path | Description |
| --- | --- | --- |
| POST | `/` | Create basket |
| GET | `/` | List active baskets (by branch) |
| POST | `/:id/lock` | Lock basket (optional query: `force`) |
| POST | `/:id/unlock` | Unlock basket |
| POST | `/:id/pay` | Record payment |
| POST | `/:id/complete` | Complete basket |

## Error handling

**GlobalExceptionFilter** returns a single error shape for all failures.

- **Success:** `{ success: true, data: ... }` (via global response interceptor).
- **Error:** `success: false` and `error`: **reason** (e.g. `REQUIRED`, `INVALID`, `NOT_FOUND`, `BASKET_LOCKED`), **field** (validation/DB field or `null`).

HTTP status follows usual semantics (e.g. 400 validation, 404 not found, 409 conflict, 422 domain rules, 500 unexpected). Codes and messages live in **error-definitions.config**; class-validator and MongoDB errors (`ValidationError`, `CastError`, duplicate key) map into the same **reason + field** model.

## Testing

Under `test/modules/basket/v1/device/`, each flow (create, list, lock, unlock, pay, complete) has:

- `*.integration.spec.ts` — HTTP + DB
- `*.fixture.ts` — fixtures and request builders
- `test-cases.md` — optional checklist

Run: `pnpm run test:integration`. Reports: `reports/tests/integration/`.

## MongoDB

### Connection

Configured in [`DatabaseConfig`](src/modules/shared/database/database.config.ts). Pool and timeout env values are passed with `Number(...)`.

| Environment variable | Mongoose option | Description |
| --- | --- | --- |
| `MONGO_URL`, `MONGO_DATABASE` | `uri` | Base URI plus database name; query string from `MONGO_URL` is kept. |
| `MONGO_SSLCA` (optional) | TLS | If set: `tls: true`, `tlsCAFile` (PEM path). |
| `MONGO_CONNECT_TIMEOUT_MS` | `connectTimeoutMS` | Time to establish a connection (ms). Default in `env.config.ts`: `3000`. |
| `MONGO_SOCKET_TIMEOUT_MS` | `socketTimeoutMS` | Socket idle timeout (ms). Default: `10000`. |
| `MONGO_MAX_POOL_SIZE` | `maxPoolSize` | Max pool connections. Default: `100`. |
| `MONGO_MIN_POOL_SIZE` | `minPoolSize` | Min pool connections. Default: `0`. |

### Query timeout (`maxTimeMS`)

A global Mongoose plugin sets `MONGO_MAX_TIME_MS` on every query and aggregation so the server aborts when processing exceeds the limit.

| | `MONGO_MAX_TIME_MS` |
| --- | --- |
| Enforced by | MongoDB server |
| Measures | Server-side processing time |
| Catches | Slow queries (e.g. full scans, missing indexes, heavy pipelines) |
| Typical error | `MongoServerError` code 50 |

Example:

```
MONGO_MAX_TIME_MS=10000
```

## Links

- [Postman collection](https://speeding-moon-959412.postman.co/workspace/TokenX---Energy~ac8f2a9c-8719-4a4a-b308-fbfcd6785142/collection/31664195-3f231a63-6675-4bb2-86c5-501f351a6bcb?action=share&source=copy-link&creator=31664195)
- [Confluence — TokenX Energy](https://tokeninc.atlassian.net/wiki/spaces/TE/overview?homepageId=228065655)

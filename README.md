# Database Sync (db-sync)

POC: This multi-tenant solution should be able to sync a local database with its cloud bidirectionally

## Specification

- Create Cloud Database configuration for new users automatically
- Authenticate incoming requests and pick the correct database connection
- Replicate changes between the Cloud DB and the Local DB bidirectionally

### Diagram

```mermaid
flowchart TB
  API((API))
  MainDb[(Main DB)]
  TenantA[[Tenant A]]
  TenantB[[Tenant B]]
  CloudDbA[(Cloud DB A)]
  CloudDbB[(Cloud DB B)]
  ClientA1[Client A1]
  ClientA2[Client A2]
  LocalDbA[(Local A)]
  ClientB1[Client B1]
  ClientB2[Client B2]
  LocalDbB[(Local B)]

  TenantA === ClientA1
  TenantA === ClientA2
  ClientA1 <--> LocalDbA
  ClientA2 <--> LocalDbA

  TenantB === ClientB1
  TenantB === ClientB2
  ClientB1 <--> LocalDbB
  ClientB2 <--> LocalDbB

  ClientA1 <-.on change.-> API
  ClientA2 <-.on change.-> API

  ClientB1 <-.on change.-> API
  ClientB2 <-.on change.-> API

  API <--> MainDb

  API <-.on request.-> CloudDbA
  API <-.on request.-> CloudDbB
```

## How to run locally

### 1. Create `./.env` file

```txt
MAIN_DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
TENANT_DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Update the database URLs as required. If the database instances do not contain the right schema, you can create that using `prisma db push` once the dependencies are ready.

### 2. Install dependencies

```bash
pnpm install
```

Once the installation completes, `postinstall` should generate the PrismaClients.

### 3. Run `dev` or `start`

```bash
pnpm dev
```

```bash
pnpm start
```

## How to update database schema

There are two `.prisma` files inside `./prisma/`.

- `schema.prisma` for the Main Database
- `tenant-schema.prisma` for the Tenant Database

Do the necessary changes in the appropriate file and run the correct script.

### Schema changes on the Main Database

```bash
pnpm prisma:main:push
```

### Schema changes on the Tenant Database

```bash
pnpm prisma:tenant:push
```

## How to use the PrismaClient inside NestJS Application

### MainPrismaService

```ts
import { MainPrismaService } from '@/modules/prisma/main-prisma.service';

export class NestJSComponent {
  constructor(
    private readonly mainPrisma: MainPrismaService,
  ) {}
}
```

```ts
> Example:

@Get('/tenants')
async getTenants() {
  const tenants = await this.mainPrisma.tenant.findMany();

  return { tenants };
}
```

### TenantPrismaService

```ts
import { TENANT_PRISMA_SERVICE, TenantPrismaService } from '@/modules/prisma/tenant-prisma.service';

export class NestJSComponent {
  constructor(
    @Inject(TENANT_PRISMA_SERVICE) private readonly tenantPrisma: TenantPrismaService
  ) {}
}
```

```ts
> Example:

@Get('/users')
async getUsers() {
  /**
   * Since we're using query extensions with the Prisma client,
   * this query should return only the users with the column
   * "tenantId" matching that in the request "x-tenant-code".
   */
  const users = await this.tenantPrisma.user.findMany();

  return { users };
}
```

## Diagrams

### Request-Response Life Cycle

```mermaid
flowchart TB
  Client((Client))
  API((API))
  MainDB[(MainDB)]
  Guards[[AuthGuard<br>UserGuard<br>RolesGuard]]

  Client --Request--> API --> RequestLoggerMiddleware --> TenantDatasourceMiddleware --> Guards --> Controller --> API --Response--> Client
  TenantDatasourceMiddleware---MainDB
```

### Entity Relationship

```mermaid
erDiagram
    Main--Tenant {
        int id PK
        string code
        string name
        string website
        json metadata
        int datasourceId FK
    }
    Main--Datasource {
        int id PK
        string name
        string url
        json metadata
    }
    TenantDBX--Entity {
        int id PK
        any key
        int tenantId FK
    }
    Main--Tenant ||--o| Main--Datasource : has
    Main--Tenant ||--o{ TenantDBX--Entity : has
```

### Data

#### Datasources

| Datasource    | Main DB  | Tenant DB 1 | Tenant DB 2 | Tenant DB 3 |
| ------------- | -------- | ----------- | ----------- | ----------- |
| **Tenant(s)** | Metadata | A<br>B<br>C | D<br>E<br>F | G<br>H<br>I |

#### Data flow

```mermaid
flowchart LR
  API((API Main))
  APITSM[[TenantDatasourceMiddleware]]
  APIController[[Controller]]
  MainDb[(Main DB)]
  TenantDb1[(Tenant DB 1)]
  TenantDb2[(Tenant DB 2)]
  TenantDb3[(Tenant DB 3)]
  ClientA[Client A]
  ClientB[Client B]
  ClientC[Client C]
  ClientD[Client D]
  ClientE[Client E]
  ClientF[Client F]
  ClientG[Client G]
  ClientH[Client I]

  API <--(1)--> APITSM <--Get datasourceUrl--> MainDb
  API --(2)--> APIController
  ClientA --Data A--> API
  ClientB --Data B--> API
  ClientC --Data C--> API
  ClientD --Data D--> API
  ClientE --Data E--> API
  ClientF --Data F--> API
  ClientG --Data G--> API
  ClientH --Data H--> API
  ClientI --Data I--> API
  APIController -.Data A.->TenantDb1
  APIController -.Data B.->TenantDb1
  APIController -.Data C.->TenantDb1
  APIController -.Data D.->TenantDb2
  APIController -.Data E.->TenantDb2
  APIController -.Data F.->TenantDb2
  APIController -.Data G.->TenantDb3
  APIController -.Data H.->TenantDb3
  APIController -.Data I.->TenantDb3
```

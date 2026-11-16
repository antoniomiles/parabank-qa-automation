# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\bank.spec.ts >> API-03 @negative @regression nonexistent account
- Location: tests\api\bank.spec.ts:18:1

# Error details

```
AggregateError: apiRequestContext.get: connect EACCES 104.20.38.142:443
connect EACCES 172.66.170.155:443
Call log:
  - → GET https://parabank.parasoft.com/parabank/services/bank/accounts/2147483647
    - user-agent: Playwright/1.65.1 (x64; windows 10.0) node/26.13
    - accept: application/json
    - accept-encoding: gzip,deflate,br

```

# Test source

```ts
  1  | import type { APIRequestContext, APIResponse, TestInfo } from '@playwright/test';
  2  | 
  3  | export class BankApi {
  4  |   constructor(private readonly request: APIRequestContext, private readonly info: TestInfo) {}
  5  |   async get(path: string): Promise<APIResponse> {
> 6  |     const response = await this.request.get(`/parabank/services/bank/${path}`, {
     |                                         ^ AggregateError: apiRequestContext.get: connect EACCES 104.20.38.142:443
  7  |       headers: { Accept: 'application/json' },
  8  |     });
  9  |     await this.info.attach('api-response', {
  10 |       body: JSON.stringify({ path, status: response.status(), contentType: response.headers()['content-type'], body: await response.text() }, null, 2),
  11 |       contentType: 'application/json',
  12 |     });
  13 |     return response;
  14 |   }
  15 | }
  16 | 
```
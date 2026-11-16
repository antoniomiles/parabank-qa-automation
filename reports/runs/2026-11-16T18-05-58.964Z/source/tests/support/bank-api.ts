import type { APIRequestContext, APIResponse, TestInfo } from '@playwright/test';

export class BankApi {
  constructor(private readonly request: APIRequestContext, private readonly info: TestInfo) {}
  async get(path: string): Promise<APIResponse> {
    const response = await this.request.get(`/parabank/services/bank/${path}`, {
      headers: { Accept: 'application/json' },
    });
    await this.info.attach('api-response', {
      body: JSON.stringify({ path, status: response.status(), contentType: response.headers()['content-type'], body: await response.text() }, null, 2),
      contentType: 'application/json',
    });
    return response;
  }
}

import type { APIRequestContext, APIResponse, TestInfo } from '@playwright/test';

export class BankApi {
  constructor(private readonly request: APIRequestContext, private readonly info: TestInfo) {}
  async get(path: string) {
    return this.send('GET', path);
  }

  async post(path: string, data: unknown, params: Record<string, string | number>) {
    return this.send('POST', path, data, params);
  }

  private async send(method: 'GET' | 'POST', path: string, data?: unknown, params?: Record<string, string | number>): Promise<APIResponse> {
    await this.info.attach('api-request', {
      body: JSON.stringify({ method, path, data, params }, null, 2), contentType: 'application/json',
    });
    let response: APIResponse;
    try {
      response = await this.request.fetch(`/parabank/services/bank/${path}`, {
        method, data, params, headers: { Accept: 'application/json' },
      });
    } catch (error) {
      await this.info.attach('api-transport-error', {
        body: JSON.stringify({ method, path, error: String(error) }, null, 2), contentType: 'application/json',
      });
      throw error;
    }
    await this.info.attach('api-response', {
      body: JSON.stringify({ path, status: response.status(), contentType: response.headers()['content-type'], body: await response.text() }, null, 2),
      contentType: 'application/json',
    });
    return response;
  }
}

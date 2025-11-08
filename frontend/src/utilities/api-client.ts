import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import { match } from "ts-pattern";
import { getEnvironment } from "./environment-utilities";

const DEV_BACKEND_ROOT = "http://localhost:8000";
const PROD_BACKEND_ROOT = "https://api.chrisgregory.me";

export class ApiClient {
  apiBaseUrl: string;
  convertServerToCamel: boolean;
  convertClientToSnake: boolean;

  constructor(
    apiBaseUrl?: string,
    convertServerToCamel: boolean = true,
    convertClientToSnake: boolean = true,
  ) {
    this.apiBaseUrl = apiBaseUrl || this.getApiBaseUrl();
    this.convertServerToCamel = convertServerToCamel;
    this.convertClientToSnake = convertClientToSnake;
  }

  private getApiBaseUrl(): string {
    return match(getEnvironment())
      .with("development", () => DEV_BACKEND_ROOT)
      .with("production", () => PROD_BACKEND_ROOT)
      .exhaustive();
  }

  async get<ResT>(path: string): Promise<ResT> {
    const response = await fetch(`${this.apiBaseUrl}/${path}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    await this.throwOnError(response);
    const responseJson = await response.json();
    return this.convertServerToCamel
      ? this.toCamel(responseJson)
      : responseJson;
  }

  async post<ReqT, ResT>(path: string, body: ReqT): Promise<ResT> {
    const snakeBody = this.convertClientToSnake ? this.toSnake(body) : body;
    const response = await fetch(`${this.apiBaseUrl}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(snakeBody),
    });
    await this.throwOnError(response);
    const responseJson = await response.json();
    return this.convertServerToCamel
      ? this.toCamel(responseJson)
      : responseJson;
  }

  async delete<ResT>(path: string): Promise<ResT> {
    const response = await fetch(`${this.apiBaseUrl}/${path}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    await this.throwOnError(response);
    const responseJson = await response.json();
    return this.convertServerToCamel
      ? this.toCamel(responseJson)
      : responseJson;
  }

  async patch<ReqT, ResT>(path: string, body: ReqT): Promise<ResT> {
    const snakeBody = this.convertClientToSnake ? this.toSnake(body) : body;
    const response = await fetch(`${this.apiBaseUrl}/${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(snakeBody),
    });
    await this.throwOnError(response);
    const responseJson = await response.json();
    return this.convertServerToCamel
      ? this.toCamel(responseJson)
      : responseJson;
  }

  private async throwOnError(response: Response): Promise<void> {
    if (!response.ok) {
      const responseText = await response.text();
      console.error(`HTTP error! status: ${response.status}`, responseText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toSnake(obj: any): any {
    return snakecaseKeys(obj, { deep: true });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toCamel(obj: any): any {
    return camelcaseKeys(obj, { deep: true });
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

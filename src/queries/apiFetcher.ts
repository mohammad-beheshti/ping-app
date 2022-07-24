import {ApiContext} from "./apiContext";
import {fetch, HttpVerb, Body} from "@tauri-apps/api/http";
const baseUrl = "https://pa.goldsrc.dev";

export type ErrorWrapper<TError> =
  | TError
  | {status: "unknown"; payload: string};

export type ApiFetcherOptions<TBody, THeaders, TQueryParams, TPathParams> = {
  url: string;
  method: string;
  body?: TBody;
  headers?: THeaders;
  queryParams?: TQueryParams;
  pathParams?: TPathParams;
} & ApiContext["fetcherOptions"];

export async function apiFetch<
  TData,
  TError,
  TBody extends {} | undefined | null,
  THeaders extends {},
  TQueryParams extends {},
  TPathParams extends {},
>({
  url,
  method,
  body,
  headers,
  pathParams,
  queryParams,
}: ApiFetcherOptions<
  TBody,
  THeaders,
  TQueryParams,
  TPathParams
>): Promise<TData> {
  const response = await fetch(
    `${baseUrl}${resolveUrl(url, queryParams, pathParams)}`,
    {
      method: method.toUpperCase() as HttpVerb,

      body: body ? Body.json(body) : undefined,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    },
  );
  if (!response.ok) {
    let error: ErrorWrapper<TError>;
    try {
      error = response.data as ErrorWrapper<TError>;
    } catch (e) {
      error = {
        status: "unknown" as const,
        payload:
          e instanceof Error
            ? `Unexpected error (${e.message})`
            : "Unexpected error",
      };
    }

    throw error;
  }

  return response.data as TData;
}

const resolveUrl = (
  url: string,
  queryParams: Record<string, string> = {},
  pathParams: Record<string, string> = {},
) => {
  let query = new URLSearchParams(queryParams).toString();
  if (query) query = `?${query}`;
  return url.replace(/\{\w*\}/g, (key) => pathParams[key.slice(1, -1)]) + query;
};

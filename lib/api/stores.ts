import { TStoreDoc } from "@/models/Store";
import { apiFetch } from "./api";
import { PaginationMeta } from "@/app/types";

export type GetStoresOptions = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortField?: string;
  order?: "asc" | "desc";
  fields?: string[];
};

export type GetStoresResponse = {
  success: boolean;
  data: TStoreDoc[];
  meta: PaginationMeta;
};

export function getStores(options: GetStoresOptions = {}) {
  const query = new URLSearchParams();

  if (options.page) query.append("page", options.page.toString());
  if (options.limit) query.append("limit", options.limit.toString());
  if (options.search) query.append("search", options.search);
  if (options.isActive !== undefined)
    query.append("is_active", String(options.isActive));
  if (options.sortField) query.append("sort", options.sortField);
  if (options.order) query.append("order", options.order);
  if (options.fields) query.append("fields", options.fields.join(","));

  return apiFetch<GetStoresResponse>(`/api/stores?${query.toString()}`);
}

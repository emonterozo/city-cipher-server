import { AccountType } from "../enums";
import { apiFetch } from "./api";

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message?: string;
  id: string;
  type: AccountType;
  account_name: string;
  access_token: string;
  refresh_token: string;
};

export function login(payload: LoginPayload) {
  return apiFetch<LoginResponse>("/api/accounts/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

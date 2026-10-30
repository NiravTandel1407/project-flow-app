export interface User {
  id: number;
  email: string;
  full_name?: string | null;
  is_admin?: boolean;
}

export interface LoginPayload {
  username?: string; // used for OAuth2 form
  email?: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name?: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}


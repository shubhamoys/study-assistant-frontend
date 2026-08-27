import { gql } from "@apollo/client";
import type { AuthUser } from "./auth-slice";

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        id
        email
        displayName
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        email
        displayName
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      displayName
    }
  }
`;

interface AuthPayloadResult {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterMutationData {
  register: AuthPayloadResult;
}

export interface RegisterMutationVars {
  input: { email: string; password: string };
}

export interface LoginMutationData {
  login: AuthPayloadResult;
}

export interface LoginMutationVars {
  input: { email: string; password: string };
}

export interface LogoutMutationData {
  logout: boolean;
}

export interface MeQueryData {
  me: AuthUser;
}

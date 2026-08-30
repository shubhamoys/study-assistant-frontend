import { gql } from "@apollo/client";
import type { AuthUser } from "./auth-slice";

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        displayName
        avatarUrl
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        displayName
        avatarUrl
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout($refreshToken: String!) {
    logout(refreshToken: $refreshToken)
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      displayName
      avatarUrl
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`;

export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token)
  }
`;

export const RESEND_VERIFICATION_EMAIL_MUTATION = gql`
  mutation ResendVerificationEmail {
    resendVerificationEmail
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

interface AuthPayloadResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RegisterMutationData {
  register: AuthPayloadResult;
}

export interface RegisterMutationVars {
  input: { email: string; password: string; displayName: string };
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

export interface LogoutMutationVars {
  refreshToken: string;
}

export interface MeQueryData {
  me: AuthUser;
}

export interface ForgotPasswordMutationData {
  forgotPassword: boolean;
}

export interface ForgotPasswordMutationVars {
  email: string;
}

export interface ResetPasswordMutationData {
  resetPassword: boolean;
}

export interface ResetPasswordMutationVars {
  input: { token: string; newPassword: string };
}

export interface VerifyEmailMutationData {
  verifyEmail: boolean;
}

export interface VerifyEmailMutationVars {
  token: string;
}

export interface ResendVerificationEmailMutationData {
  resendVerificationEmail: boolean;
}

export interface ChangePasswordMutationData {
  changePassword: boolean;
}

export interface ChangePasswordMutationVars {
  input: { currentPassword: string; newPassword: string };
}

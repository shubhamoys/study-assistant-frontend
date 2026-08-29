import { gql } from "@apollo/client";

export const ACCOUNT_QUERY = gql`
  query Account {
    me {
      id
      email
      displayName
      avatarUrl
      isEmailVerified
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      displayName
    }
  }
`;

export interface AccountUser {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  isEmailVerified: boolean;
}

export interface AccountQueryData {
  me: AccountUser;
}

export interface UpdateProfileMutationData {
  updateProfile: { id: string; displayName: string | null };
}

export interface UpdateProfileMutationVars {
  input: { displayName: string };
}

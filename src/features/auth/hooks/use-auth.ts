"use client";

import {
  useAuthSessionQuery,
  useUserProfileQuery,
} from "../queries/auth-queries";

export function useAuth() {
  const sessionQuery = useAuthSessionQuery();
  const isAuthenticated = sessionQuery.data?.isAuthenticated ?? false;
  const profileQuery = useUserProfileQuery(isAuthenticated);

  return {
    isAuthenticated,
    user: sessionQuery.data?.user ?? null,
    profile: profileQuery.data ?? null,
    isLoading: sessionQuery.isLoading || profileQuery.isLoading,
    sessionQuery,
    profileQuery,
  };
}

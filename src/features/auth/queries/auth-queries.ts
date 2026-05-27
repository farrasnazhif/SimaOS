import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export type AuthSessionData = {
  isAuthenticated: boolean;
  user: User | null;
};

const authKeys = {
  session: ["auth", "session"] as const,
  userProfile: ["auth", "profile"] as const,
};

export function useAuthSessionQuery() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: async (): Promise<AuthSessionData> => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      const user = data.session?.user ?? null;
      return { isAuthenticated: Boolean(user), user };
    },
    staleTime: 0,
  });
}

export function useUserProfileQuery(enabled?: boolean) {
  return useQuery({
    queryKey: authKeys.userProfile,
    enabled,
    queryFn: async (): Promise<User> => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },
    staleTime: 0,
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.session });
      await queryClient.invalidateQueries({ queryKey: authKeys.userProfile });
    },
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.session });
      await queryClient.invalidateQueries({ queryKey: authKeys.userProfile });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.session });
      await queryClient.invalidateQueries({ queryKey: authKeys.userProfile });
    },
  });
}


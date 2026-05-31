"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import Input from "@/components/ui/input";
import Button from "@/components/ui/buttons/button";
import { useLoginMutation } from "@/features/auth/queries/auth-queries";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginView() {
  const router = useRouter();
  const login = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    const toastId = toast.loading("Signing in...");

    try {
      await login.mutateAsync(data);

      toast.success("Signed in successfully!", {
        id: toastId,
      });

      router.push("/dashboard");
    } catch (error) {
      toast.error("Login failed", {
        id: toastId,
        description:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 md:px-6 py-16">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center">
        <div className="w-full   bg-transparent p-8 ">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-zinc-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Sign in to continue using SimaOS.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={Mail}
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email",
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={Lock}
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={login.isPending}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-emerald-600 hover:text-emerald-700"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import Input from "@/components/ui/input";
import Button from "@/components/ui/buttons/button";

import { useRegisterMutation } from "@/features/auth/auth-queries";

type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();

  const {
    register,

    handleSubmit,

    watch,

    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch("password");

  async function onSubmit(data: RegisterFormValues) {
    const toastId = toast.loading("Creating account...");

    try {
      await registerMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });

      toast.success("Registered successfully!");

      router.push("/dashboard");
    } catch (error) {
      toast.error("Registration failed", {
        id: toastId,
        description:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 md:px-6 py-16">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center">
        <div className="w-full bg-transparent p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-zinc-900">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Create your SimaOS account to get started.
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
              // helperText="Minimum 6 characters"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              leftIcon={Lock}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Please confirm your password",

                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={registerMutation.isPending}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-emerald-600 hover:text-emerald-700"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

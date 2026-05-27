"use client";

import Button from "@/components/ui/buttons/button";
import IconButton from "@/components/ui/buttons/icon-button";
import { ArrowRight, House } from "lucide-react";

function Section({
  title,

  children,
}: {
  title: string;

  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6 w-full max-w-6xl">
      <h2 className="text-xl font-semibold text-white">{title}</h2>

      {children}
    </section>
  );
}

function ButtonGroup({
  variant,
}: {
  variant: "primary" | "secondary" | "gradient-green";
}) {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <Button variant={variant} size="lg">
        Continue
      </Button>

      <Button variant={variant} size="base">
        Continue
      </Button>

      <Button variant={variant} size="sm">
        Continue
      </Button>

      <Button variant={variant} size="base" disabled>
        Disabled
      </Button>

      <Button variant={variant} size="base" isLoading>
        Loading
      </Button>
    </div>
  );
}

function ButtonWithIconGroup({
  variant,
}: {
  variant: "primary" | "secondary" | "gradient-green";
}) {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <Button variant={variant} size="base" leftIcon={House}>
        Home
      </Button>

      <Button variant={variant} size="base" rightIcon={ArrowRight}>
        Next
      </Button>

      <Button variant={variant} size="base" leftIcon={House} isLoading>
        Loading
      </Button>
    </div>
  );
}

function IconButtonGroup({
  variant,
}: {
  variant: "primary" | "secondary" | "gradient-green";
}) {
  return (
    <div className="flex items-center justify-center gap-4">
      <IconButton variant={variant} size="lg" icon={House} />

      <IconButton variant={variant} size="base" icon={House} />

      <IconButton variant={variant} size="sm" icon={House} />

      <IconButton variant={variant} size="base" icon={House} isLoading />

      <IconButton variant={variant} size="base" icon={House} disabled />
    </div>
  );
}

export default function ButtonSandboxPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center text-center py-16 text-black bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-black">SimaOS Button Sandbox</h1>

        <p className="text-gray-800">
          Visual playground for SimaOS Button & IconButton system.
        </p>
      </div>

      <Section title="Buttons – Variants">
        <ButtonGroup variant="primary" />

        <ButtonGroup variant="secondary" />

        <ButtonGroup variant="gradient-green" />
      </Section>

      <Section title="Buttons – With Icons">
        <ButtonWithIconGroup variant="primary" />

        <ButtonWithIconGroup variant="secondary" />

        <ButtonWithIconGroup variant="gradient-green" />
      </Section>

      <Section title="Icon Buttons">
        <IconButtonGroup variant="primary" />

        <IconButtonGroup variant="secondary" />

        <IconButtonGroup variant="gradient-green" />
      </Section>
    </main>
  );
}

"use client";

import {
  BellIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  InfoIcon,
  Loader2Icon,
  SparklesIcon,
  ArchiveIcon,
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/buttons/button";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md p-8 ">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>

        {description && (
          <p className="mt-2 text-sm text-zinc-500">{description}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {children}
      </div>
    </section>
  );
}

export default function SonnerSandboxPage() {
  function simulatePromise() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.4;

        if (success) {
          resolve("done");
        } else {
          reject("failed");
        }
      }, 2500);
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6">
        <div className="space-y-3 text-center">
          <h1 className="bg-gradient-to-r from-zinc-900 to-emerald-600 bg-clip-text text-4xl font-semibold text-transparent">
            SimaOS Sonner Sandbox
          </h1>

          <p className="max-w-2xl text-zinc-500">
            Test notification patterns for batch intelligence workflows,
            inspections, approvals, AI grading, and manufacturing operations.
          </p>
        </div>

        <Section
          title="Basic Notifications"
          description="General operational notifications used across SimaOS."
        >
          <Button
            variant="primary"
            leftIcon={BellIcon}
            onClick={() =>
              toast("New batch received.", {
                description: "Batch B-2405 has entered the inspection queue.",
              })
            }
          >
            Default Toast
          </Button>

          <Button
            leftIcon={InfoIcon}
            onClick={() =>
              toast.info("Knowledge base updated.", {
                description:
                  "A new defect resolution procedure has been published.",
              })
            }
          >
            Info Toast
          </Button>
        </Section>

        <Section
          title="Status Variants"
          description="Success, warning, and error states for manufacturing workflows."
        >
          <Button
            variant="primary"
            leftIcon={CheckCircle2Icon}
            onClick={() =>
              toast.success("Batch approved.", {
                description: "Quality inspection completed successfully.",
              })
            }
          >
            Success
          </Button>

          <Button
            leftIcon={AlertTriangleIcon}
            onClick={() =>
              toast.warning("Risk threshold exceeded.", {
                description: "Defect rate is trending above acceptable limits.",
              })
            }
          >
            Warning
          </Button>

          <Button
            leftIcon={AlertTriangleIcon}
            onClick={() =>
              toast.error("Inspection failed.", {
                description: "Critical quality deviations were detected.",
              })
            }
          >
            Error
          </Button>
        </Section>

        <Section
          title="Loading States"
          description="Useful for AI grading, batch analysis, and report generation."
        >
          <Button
            variant="primary"
            leftIcon={Loader2Icon}
            onClick={() => {
              const id = toast.loading("Analyzing production batch...");

              setTimeout(() => {
                toast.success("Analysis completed.", {
                  id,
                  description: "AI grading report is now available.",
                });
              }, 2500);
            }}
          >
            Loading → Success
          </Button>
        </Section>

        <Section
          title="Promise Workflow"
          description="Best pattern for API requests and AI-powered operations."
        >
          <Button
            leftIcon={SparklesIcon}
            onClick={() =>
              toast.promise(simulatePromise(), {
                loading: "Generating batch intelligence report...",
                success: "Batch intelligence report generated successfully.",
                error: "Unable to generate batch intelligence report.",
              })
            }
          >
            Promise Flow
          </Button>
        </Section>

        <Section
          title="Action Toast"
          description="Useful for reversible dashboard operations."
        >
          <Button
            leftIcon={ArchiveIcon}
            onClick={() =>
              toast("Inspection archived.", {
                description: "The inspection record has been moved to archive.",
                action: {
                  label: "Undo",
                  onClick: () =>
                    toast.success("Inspection restored successfully."),
                },
              })
            }
          >
            Archive + Undo
          </Button>
        </Section>
      </div>
    </main>
  );
}

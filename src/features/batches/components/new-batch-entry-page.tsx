"use client";

import Link from "next/link";
import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  BadgeAlert,
  ChevronRight,
  ImagePlus,
  PackageSearch,
  Sparkles,
} from "lucide-react";

import Button from "@/components/ui/buttons/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useQc } from "@/features/qc/hooks/use-qc";
import { InspectionAnalysis } from "@/features/qc/types/qc-types";
import { cn } from "@/lib/utils";

type BatchIntakeFormValues = {
  materialType: string;
  supplier: string;
  quantityKg: string;
  inspectionPhoto: File | null;
};

const materialOptions = [
  { label: "Ginger Root", value: "Ginger Root" },
  { label: "Turmeric", value: "Turmeric" },
  { label: "Cinnamon Bark", value: "Cinnamon Bark" },
  { label: "Clove Buds", value: "Clove Buds" },
];

const supplierOptions = [
  { label: "Sima Farmer Collective", value: "Sima Farmer Collective" },
  { label: "Nusantara Spice Co.", value: "Nusantara Spice Co." },
  { label: "Java Harvest Partners", value: "Java Harvest Partners" },
];

const uploadHighlights = ["Min 4K inspection photo", "Macro lens recommended"];

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read the inspection photo."));
    };

    reader.onerror = () => {
      reject(new Error("Unable to read the inspection photo."));
    };

    reader.readAsDataURL(file);
  });
}

export default function NewBatchEntryPage() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [analysis, setAnalysis] = React.useState<InspectionAnalysis | null>(
    null,
  );
  const { createBatchWithQc, isProcessing } = useQc();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<BatchIntakeFormValues>({
    defaultValues: {
      materialType: "",
      supplier: "",
      quantityKg: "",
      inspectionPhoto: null,
    },
  });

  const materialType = useWatch({ control, name: "materialType" });
  const supplier = useWatch({ control, name: "supplier" });
  const selectedPhoto = useWatch({ control, name: "inspectionPhoto" });

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function updateSelectedFile(file: File | null) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setAnalysis(null);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setValue("inspectionPhoto", file, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (file) {
      clearErrors("inspectionPhoto");
      return;
    }

    setError("inspectionPhoto", {
      type: "required",
      message: "An inspection photo is required.",
    });
  }

  const quantityField = register("quantityKg", {
    required: "Quantity is required.",
    validate: (value) =>
      Number(value) > 0 || "Quantity must be greater than 0 kg.",
  });

  async function onSubmit(data: BatchIntakeFormValues) {
    if (!data.inspectionPhoto) {
      setError("inspectionPhoto", {
        type: "required",
        message: "An inspection photo is required.",
      });

      return;
    }

    const imageDataUrl = await fileToDataUrl(data.inspectionPhoto);
    const result = await createBatchWithQc({
      materialType: data.materialType,
      supplier: data.supplier,
      quantityKg: Number(data.quantityKg),
      imageDataUrl,
    });

    setAnalysis(result.analysis);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4 py-8 md:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            <Link href="/dashboard" className="transition hover:text-emerald-700">
              Batches
            </Link>

            <ChevronRight className="size-3.5 text-zinc-400" />

            <span>Create new intake</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
              New Batch Entry
            </h1>

            <p className="max-w-3xl text-base text-zinc-600 md:text-lg">
              Precision intake logging for industrial traceability. Capture the
              inbound material details and send the inspection photo for AI
              reasoning.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <PackageSearch className="size-6" />
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-zinc-900">
                    Batch Parameters
                  </h2>

                  <p className="text-sm text-zinc-500">
                    Seed the lot record before AI QC review.
                  </p>
                </div>
              </div>

              <form
                className="space-y-5"
                onSubmit={handleSubmit(async (data) => {
                  const promise = onSubmit(data);

                  toast.promise(promise, {
                    loading: "Running OpenAI inspection reasoning and saving batch...",
                    success: "Batch saved to Supabase successfully.",
                    error: (error) =>
                      error instanceof Error
                        ? error.message
                        : "Unable to complete inspection reasoning.",
                  });

                  await promise;
                })}
              >
                <Select
                  label="Material Type"
                  placeholder="Select material type..."
                  value={materialType}
                  error={errors.materialType?.message}
                  options={materialOptions}
                  onChange={(value) => {
                    setValue("materialType", value, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                    clearErrors("materialType");
                  }}
                />

                <Select
                  label="Supplier"
                  placeholder="Select certified supplier..."
                  value={supplier}
                  error={errors.supplier?.message}
                  options={supplierOptions}
                  onChange={(value) => {
                    setValue("supplier", value, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                    clearErrors("supplier");
                  }}
                />

                <input
                  type="hidden"
                  {...register("materialType", {
                    required: "Material type is required.",
                  })}
                />

                <input
                  type="hidden"
                  {...register("supplier", {
                    required: "Supplier is required.",
                  })}
                />

                <Input
                  label="Quantity (kg)"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  error={errors.quantityKg?.message}
                  {...quantityField}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting || isProcessing}
                  className="w-full rounded-2xl"
                  leftIcon={Sparkles}
                >
                  Initiate Batch Process
                </Button>
              </form>
            </section>

            <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <BadgeAlert className="size-6" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-zinc-900">
                    Compliance Reminder
                  </h3>

                  <p className="text-sm leading-6 text-zinc-600">
                    All material uploads require a clear inspection photo for
                    AI-assisted validation, audit trails, and downstream batch
                    passport events.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section
              className={cn(
                "rounded-3xl border-2 border-dashed bg-white/80 p-6 shadow-sm transition-colors md:p-8",
                isDragging
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-zinc-200",
              )}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);

                const file = event.dataTransfer.files?.[0];
                if (file) {
                  updateSelectedFile(file);
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/tiff"
                className="hidden"
                onChange={(event) => {
                  updateSelectedFile(event.target.files?.[0] ?? null);
                }}
              />

              <button
                type="button"
                className="w-full text-left"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex min-h-[420px] flex-col items-center justify-center gap-6 rounded-[1.75rem] border border-transparent px-4 text-center">
                  {previewUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Inspection preview"
                        className="h-64 w-full max-w-2xl rounded-3xl object-cover shadow-sm"
                      />

                      <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-zinc-900">
                          Inspection Photo Ready
                        </h2>

                        <p className="text-sm text-zinc-500">
                          {selectedPhoto?.name}
                        </p>

                        <p className="text-base text-zinc-600">
                          Click to replace the image or continue to run AI QC
                          reasoning and save the intake to Supabase.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex size-24 items-center justify-center rounded-3xl border border-zinc-200 bg-zinc-50 text-emerald-700 shadow-sm">
                        <ImagePlus className="size-11" />
                      </div>

                      <div className="space-y-3">
                        <h2 className="text-3xl font-semibold text-zinc-900">
                          Upload Inspection Photo
                        </h2>

                        <p className="mx-auto max-w-2xl text-lg leading-8 text-zinc-600">
                          Drag and drop raw material photos here, or click to
                          browse files for AI-assisted QC reasoning.
                        </p>
                      </div>
                    </>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {uploadHighlights.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </button>

              {errors.inspectionPhoto?.message && (
                <p className="mt-4 text-sm text-red-500">
                  {errors.inspectionPhoto.message}
                </p>
              )}
            </section>

            {analysis && (
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-zinc-900">
                      AI Inspection Snapshot
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                      Generated from the uploaded intake photo via OpenAI
                      vision reasoning.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-600 px-4 py-3 text-center text-white shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                      Quality Score
                    </div>
                    <div className="text-2xl font-semibold">
                      {analysis.qualityScore}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                      Color Assessment
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      {analysis.colorAssessment}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                      Recommendation
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      {analysis.recommendation}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                      Observed Defects
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      {analysis.defects.length > 0
                        ? analysis.defects.join(", ")
                        : "No visible defects detected."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                      Foreign Matter
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      {analysis.foreignMatter
                        ? "Potential foreign matter detected."
                        : "No visible foreign matter detected."}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    Inspector Notes
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-700">
                    {analysis.notes}
                  </p>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

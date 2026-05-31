"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  ImagePlus,
  Lightbulb,
  PackageSearch,
  SquareArrowDown,
} from "lucide-react";

import Button from "@/components/ui/buttons/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import PageHeader from "@/components/ui/page-header";
import { useQc } from "@/features/qc/hooks/use-qc";
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
  { label: "Black Pepper", value: "Black Pepper" },
  { label: "Nutmeg", value: "Nutmeg" },
];

const supplierOptions = [
  { label: "Sima Farmer Collective", value: "Sima Farmer Collective" },
  { label: "Nusantara Spice Co.", value: "Nusantara Spice Co." },
  { label: "Java Harvest Partners", value: "Java Harvest Partners" },
];

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
  const [fileName, setFileName] = React.useState<string | null>(null);

  const { createBatchWithQc, isProcessing } = useQc();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    reset,
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

  const previewUrlRef = React.useRef(previewUrl);
  // eslint-disable-next-line react-hooks/refs
  previewUrlRef.current = previewUrl;

  React.useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function updateSelectedFile(file: File | null) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setFileName(file?.name ?? null);
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

  function resetImageInput() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFileName(null);
    setValue("inspectionPhoto", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(data: BatchIntakeFormValues) {
    if (!data.inspectionPhoto) {
      setError("inspectionPhoto", {
        type: "required",
        message: "An inspection photo is required.",
      });
      throw new Error("An inspection photo is required.");
    }

    const imageDataUrl = await fileToDataUrl(data.inspectionPhoto);
    await createBatchWithQc({
      materialType: data.materialType,
      supplier: data.supplier,
      quantityKg: Number(data.quantityKg),
      imageDataUrl,
    });

    resetImageInput();
    reset();
  }

  return (
    <main className="">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader
          title="New Batch Entry"
          description="Fill in the manufacturing parameters below."
        />

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="space-y-6">
            <section className="rounded-3xl border-1 border-[#0E8752]/20 bg-white p-6  md:p-7 ">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <PackageSearch className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-900 leading-none">
                    Batch Parameters
                  </h2>
                  <p className="text-sm text-zinc-500">
                    Store the lot record before AI QC review.
                  </p>
                </div>
              </div>

              <form
                className="space-y-5"
                // eslint-disable-next-line react-hooks/refs
                onSubmit={handleSubmit(async (data) => {
                  const promise = onSubmit(data);
                  toast.promise(promise, {
                    loading: "Running inspection and saving batch...",
                    success: "Batch saved to inventory successfully.",
                    error: (error) =>
                      error instanceof Error
                        ? error.message
                        : "Unable to complete inspection.",
                  });
                  await promise;
                })}
              >
                <Select
                  label="Material Type"
                  required
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
                  required
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
                  required
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
                  className="w-full mt-1"
                  leftIcon={SquareArrowDown}
                >
                  Initiate Batch Process
                </Button>
              </form>
            </section>
          </div>

          <div className="space-y-6">
            <section
              className={cn(
                "rounded-3xl border-1 border-[#0E8752]/20 bg-white px-8 py-13 transition-all duration-200 ",
                isDragging && "border-emerald-400 bg-emerald-50/30",
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
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  fileInputRef.current?.click();
                }}
                className="w-full"
              >
                <div className="flex  flex-col items-center justify-center text-center">
                  {previewUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Inspection preview"
                        className="h-[320px] w-full rounded-[24px] object-cover"
                      />

                      <div className="mt-8">
                        <h2 className="text-[28px] font-semibold tracking-tight text-zinc-900">
                          Inspection Photo Ready
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500">{fileName}</p>

                        <p className="mt-3 text-sm text-zinc-500">
                          Click anywhere to replace the uploaded photo.
                        </p>
                      </div>

                      <div className="mt-8 rounded-[10px] bg-[#E9F1ED] px-5 py-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-[#0E8752]">
                          <Lightbulb className="size-4" />
                          Ready for AI quality inspection
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-36 w-36 items-center justify-center rounded-full border border-[#98DEB9] text-emerald-700 bg-[#EFF5F3]">
                        <ImagePlus className="size-14" />
                      </div>

                      <div className="mt-8">
                        <h2 className="text-[32px] font-semibold tracking-tight text-zinc-900">
                          Upload Batch Photo
                        </h2>

                        <p className="mx-auto mt-2 max-w-[420px] text-base  text-zinc-500">
                          Drag and drop raw material inspection photos here, or
                          click to browse files. Supported files: JPG, PNG,
                          TIFF.
                        </p>
                      </div>

                      <div className="mt-8 rounded-[10px] bg-[#E9F1ED] px-5 py-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-[#0E8752]">
                          <Lightbulb className="size-4" />
                          AI-assisted validation and audit trails
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </button>

              {errors.inspectionPhoto?.message && (
                <p className="mt-4 text-sm text-red-500">
                  {errors.inspectionPhoto.message}
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

"use server";

import "server-only";

import { GradeQcInput, InspectionAnalysis, Detection } from "../types/qc-types";

function extractOutputText(payload: unknown) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "output_text" in payload &&
    typeof payload.output_text === "string"
  ) {
    return payload.output_text.trim();
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "output" in payload &&
    Array.isArray(payload.output)
  ) {
    return payload.output
      .flatMap((item) => {
        if (
          typeof item === "object" &&
          item !== null &&
          "content" in item &&
          Array.isArray(item.content)
        ) {
          return item.content;
        }

        return [];
      })
      .flatMap((part) => {
        if (
          typeof part === "object" &&
          part !== null &&
          "type" in part &&
          part.type === "output_text" &&
          "text" in part &&
          typeof part.text === "string"
        ) {
          return [part.text];
        }

        return [];
      })
      .join("\n")
      .trim();
  }

  return "";
}

function normalizeAnalysis(payload: unknown): InspectionAnalysis {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("OpenAI returned an invalid inspection payload.");
  }

  const raw = payload as Partial<InspectionAnalysis>;

  return {
    qualityScore:
      typeof raw.qualityScore === "number"
        ? Math.max(0, Math.min(100, Math.round(raw.qualityScore)))
        : 0,
    colorAssessment:
      typeof raw.colorAssessment === "string"
        ? raw.colorAssessment
        : "No color assessment returned.",
    defects: Array.isArray(raw.defects)
      ? raw.defects.filter((item): item is string => typeof item === "string")
      : [],
    foreignMatter:
      typeof raw.foreignMatter === "boolean" ? raw.foreignMatter : false,
    recommendation:
      typeof raw.recommendation === "string"
        ? raw.recommendation
        : "Manual review recommended.",
    notes:
      typeof raw.notes === "string"
        ? raw.notes
        : "No additional notes returned.",
    detections: Array.isArray(raw.detections)
      ? raw.detections.filter(
          (d): d is Detection =>
            typeof d === "object" &&
            d !== null &&
            typeof d.label === "string" &&
            typeof d.x === "number" &&
            typeof d.y === "number" &&
            typeof d.width === "number" &&
            typeof d.height === "number",
        )
      : [],
  };
}

export async function gradeQcAction(
  input: GradeQcInput,
): Promise<InspectionAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "Missing OPENAI_API_KEY. Add it to your server environment before running AI inspection reasoning.",
    );
  }

  if (!input.imageDataUrl) {
    throw new Error("An inspection image is required.");
  }

  const openAIModel = process.env.OPENAI_VISION_MODEL || "gpt-5-mini";

  const inspectionPrompt = [
    "You are a manufacturing QC assistant for SimaOS.",
    "Analyze the uploaded raw-material intake photo and return JSON only.",
    "Use this exact shape:",
    '{"qualityScore": number, "colorAssessment": string, "defects": string[], "foreignMatter": boolean, "recommendation": string, "notes": string, "detections": [{"label": string, "x": number, "y": number, "width": number, "height": number}]}',
    "Quality score must be 0-100.",
    "detections: array of regions of interest you identified. x, y, width, height are percentages (0-100) relative to the full image. x/y is the top-left corner. Label each detection (e.g. 'discoloration', 'foreign particle', 'mold spot', 'good region').",
    "Return at least 1 detection for the primary region analyzed. Return more if defects or foreign matter are found.",
    "Only describe visual evidence from the image.",
    input.materialType ? `Material type: ${input.materialType}.` : "",
    input.supplier ? `Supplier: ${input.supplier}.` : "",
    typeof input.quantityKg === "number"
      ? `Quantity received: ${input.quantityKg} kg.`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: openAIModel,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: inspectionPrompt,
            },
            {
              type: "input_image",
              image_url: input.imageDataUrl,
              detail: "high",
            },
          ],
        },
      ],
      max_output_tokens: 400,
    }),
  });

  if (!openAIResponse.ok) {
    throw new Error("OpenAI inspection reasoning failed.");
  }

  const openAIPayload = (await openAIResponse.json()) as unknown;
  const outputText = extractOutputText(openAIPayload);
  const jsonMatch = outputText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("OpenAI did not return a parseable inspection payload.");
  }

  return normalizeAnalysis(JSON.parse(jsonMatch[0]) as unknown);
}

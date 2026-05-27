# SimaOS — Implementation Plan

Based on PRD v2.1. All features follow the established architecture in AGENTS.md.

---

## Current State (Completed)

- [x] Auth (login, register, profile)
- [x] Create batch with AI QC grading
- [x] Incoming lots table (dashboard)
- [x] Database: all tables migrated

---

## Feature Implementation Plan

### 1. Lot Detail & Digital Batch Passport

**Purpose:** View full lot info, QC results, event timeline, and knowledge notes.

```
src/app/lots/[id]/page.tsx                          → thin wrapper
src/features/lots/components/lot-detail-page.tsx    → full detail view
src/features/lots/queries/lots-queries.ts           → add useLotDetailQuery(id)
```

Sections:
- Lot metadata (material, supplier, zone, status)
- QC inspection result card
- Batch event timeline
- Knowledge notes list
- Lot images gallery

---

### 2. Human QC Approve/Reject

**Purpose:** Manager reviews AI grading and makes final decision.

```
src/features/qc/components/qc-decision-form.tsx     → approve/reject form
src/features/qc/queries/qc-queries.ts               → add useQcDecisionMutation()
```

Flow:
- Rendered inside lot detail page
- Updates `qc_inspections.human_decision` and `qc_inspections.human_notes`
- Updates `lots.status` to `approved` or `rejected`
- Inserts `batch_events` entry

---

### 3. Image Upload

**Purpose:** Upload inspection photos to Supabase Storage.

```
src/features/lots/components/lot-image-upload.tsx    → drag-and-drop upload
src/features/lots/queries/lots-queries.ts            → add useUploadLotImageMutation()
```

Flow:
- Upload to Supabase Storage bucket `lot-images`
- Insert record into `lot_images` table
- Display in lot detail gallery

---

### 4. Warehouse Zone Assignment

**Purpose:** Assign storage zone after approval.

```
src/features/lots/components/zone-assignment.tsx     → dropdown selector
src/features/lots/queries/lots-queries.ts            → add useAssignZoneMutation()
```

Zones (simplified dropdown):
- Zone A — Dry Storage
- Zone B — Cold Storage
- Zone C — Quarantine
- Zone D — Processing Queue

---

### 5. Knowledge Notes

**Purpose:** Capture factory expertise per lot/material.

```
src/features/knowledge/components/knowledge-note-form.tsx   → create note form
src/features/knowledge/components/knowledge-notes-list.tsx  → display notes
src/features/knowledge/queries/knowledge-queries.ts         → useKnowledgeNotesQuery(lotId), useCreateKnowledgeNoteMutation()
```

Note types: `observation`, `recommendation`, `historical_insight`, `defect_pattern`

---

### 6. Alerts Dashboard

**Purpose:** Surface operational risks automatically.

```
src/features/alerts/components/alerts-panel.tsx      → active alerts list
src/features/alerts/queries/alerts-queries.ts        → useAlertsQuery(), useResolveAlertMutation()
```

Alert types:
- `high_rejection_risk` — ai_quality_score < 70
- `supplier_quality_declining` — supplier rejection rate > 30%
- `qc_delay` — lot in_qc for > 48 hours
- `storage_assignment_pending` — approved but no zone

Alert generation: Server Action triggered after QC grading.

```
src/features/alerts/actions/generate-alerts-action.ts
```

---

### 7. Supplier Analytics

**Purpose:** Rank suppliers by quality performance.

```
src/features/analytics/components/supplier-analytics.tsx    → table + metrics
src/features/analytics/queries/analytics-queries.ts         → useSupplierAnalyticsQuery()
```

Metrics per supplier:
- Average quality score
- Approval rate
- Rejection rate
- Total lots received

---

### 8. Dashboard KPI Cards

**Purpose:** Summary metrics at the top of dashboard.

```
src/features/dashboard/components/kpi-cards.tsx      → 4 metric cards
src/features/dashboard/queries/dashboard-queries.ts  → useDashboardKpiQuery()
```

Cards:
- Total lots
- Pending QC
- Approved today
- Rejected today

---

### 9. Manufacturing Copilot

**Purpose:** Natural-language Q&A over operational data.

```
src/features/copilot/components/copilot-panel.tsx    → chat interface
src/features/copilot/actions/copilot-action.ts       → "use server", calls Claude with context
src/features/copilot/queries/copilot-queries.ts      → useCopilotMutation()
```

Context injected into prompt:
- Lots + QC inspections
- Supplier metrics
- Knowledge notes
- Active alerts

---

## Implementation Order (Recommended)

| Priority | Feature                    | Depends On       |
|----------|----------------------------|------------------|
| 1        | Lot Detail & Passport      | —                |
| 2        | Human QC Approve/Reject    | Lot Detail       |
| 3        | Image Upload               | Lot Detail       |
| 4        | Warehouse Zone Assignment  | Human QC         |
| 5        | Knowledge Notes            | Lot Detail       |
| 6        | Dashboard KPI Cards        | —                |
| 7        | Alerts Dashboard           | Human QC         |
| 8        | Supplier Analytics         | —                |
| 9        | Manufacturing Copilot      | Knowledge, Alerts|

---

## Seed Data (for demo)

To be created as a migration or Supabase SQL script:

- 5 lots (various statuses)
- 3 suppliers (preloaded)
- QC inspections for completed lots
- Batch events for timeline
- 3 knowledge notes
- 3 active alerts

```
supabase/migrations/YYYYMMDDHHMMSS_seed_demo_data.sql
```

---

## File Naming Reference

| Type              | Path Pattern                                          |
|-------------------|-------------------------------------------------------|
| Page              | `src/app/<route>/page.tsx`                            |
| Feature component | `src/features/<feature>/components/<name>.tsx`        |
| Query hooks       | `src/features/<feature>/queries/<feature>-queries.ts` |
| Composed hooks    | `src/features/<feature>/hooks/use-<name>.ts`          |
| Server actions    | `src/features/<feature>/actions/<name>-action.ts`     |
| Types             | `src/features/<feature>/types/<feature>-types.ts`     |

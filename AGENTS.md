<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may differ from historical training data.

Before generating code:

- Read the relevant documentation in `node_modules/next/dist/docs/`
- Follow current Next.js App Router conventions
- Respect deprecation notices
- Do not assume legacy Pages Router behavior
- Prefer modern Next.js patterns

<!-- END:nextjs-agent-rules -->

# SimaOS Engineering Guidelines

## Overview

This project uses:

- Next.js 16 App Router
- React Query (TanStack Query)
- Supabase (browser client singleton)
- React Hook Form + Zod + zodResolver
- Sonner (toast notifications)
- Tailwind CSS v4
- Feature-based architecture
- Geist font family (sans + mono)

Follow the existing structure and patterns.

Do not introduce unnecessary abstractions, folders, wrappers, or architecture changes.

---

# Core Architecture

This project prefers:

```txt
React Query
+
Supabase Browser Client
```

for internal application data access.

Do not create API routes for standard CRUD operations, authentication flows, profile management, dashboard data, AI workflows, or Supabase interactions.

Preferred flow for data fetching:

```txt
Page (thin wrapper)
↓
Feature Component
↓
React Query hook
↓
Supabase Browser Client
```

Example:

```txt
src/app/dashboard/page.tsx
↓
<IncomingLotsTable />
↓
useLotsQuery()
↓
getSupabaseBrowserClient().from("lots").select(...)
```

Preferred flow for secure server-side workflows:

```txt
Feature Component
↓
React Query mutation (via composed hook)
↓
Server Action ("use server")
↓
External Service (OpenAI, etc.)
```

Example:

```txt
<NewBatchEntryPage />
↓
useQc().createBatchWithQc()
↓
useCreateBatchWithQcMutation()
↓
gradeQcAction()
↓
OpenAI
```

---

# Project Structure

```txt
src/
├── app/                          # Route pages (thin wrappers only)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── profile/page.tsx
│   ├── batches/new/page.tsx
│   ├── dashboard/page.tsx
│   └── layout.tsx
│
├── components/
│   └── ui/                       # Shared UI primitives
│       ├── buttons/
│       │   ├── button.tsx
│       │   └── icon-button.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── sonner.tsx
│
├── features/                     # Feature modules (all logic lives here)
│   ├── auth/
│   │   ├── hooks/use-auth.ts
│   │   └── queries/auth-queries.ts
│   │
│   ├── batches/
│   │   └── components/new-batch-entry-page.tsx
│   │
│   ├── lots/
│   │   ├── components/incoming-lots-table.tsx
│   │   └── queries/lots-queries.ts
│   │
│   └── qc/
│       ├── actions/grade-qc-action.ts
│       ├── hooks/use-qc.ts
│       ├── queries/qc-queries.ts
│       └── types/qc-types.ts
│
├── lib/
│   ├── supabase/browser.ts       # Singleton browser client
│   └── utils.ts                  # cn() helper
│
└── providers/
    └── query-provider.tsx        # QueryClientProvider wrapper
```

Rules:

- Pages in `src/app/` are thin wrappers that import and render feature components.
- All business logic, queries, mutations, hooks, and UI live inside `src/features/<feature>/`.
- Shared UI primitives live in `src/components/ui/`.
- Do not create global `hooks/`, `queries/`, `types/`, or `schemas/` folders.

---

# Pages

Pages are thin. They import a feature component and render it.

```tsx
// src/app/batches/new/page.tsx
import NewBatchEntryPage from "@/features/batches/components/new-batch-entry-page";

export default function BatchesNewPage() {
  return <NewBatchEntryPage />;
}
```

```tsx
// src/app/dashboard/page.tsx
"use client";

import IncomingLotsTable from "@/features/lots/components/incoming-lots-table";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <IncomingLotsTable />
      </div>
    </main>
  );
}
```

---

# Queries

Place React Query hooks inside:

```txt
features/<feature>/queries/<feature>-queries.ts
```

Mark files with `"use client"` at the top.

Example (data fetching):

```ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export function useLotsQuery() {
  return useQuery({
    queryKey: ["lots", "list"],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("lots")
        .select("id, lot_number, material_name, arrival_date, status, supplier:suppliers(name)")
        .order("arrival_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}
```

Example (mutation):

```ts
export function useCreateBatchWithQcMutation() {
  return useMutation({
    mutationKey: ["qc", "create-batch-with-qc"],
    mutationFn: async (input: GradeQcInput) => {
      const analysis = await gradeQcAction(input);
      const supabase = getSupabaseBrowserClient();
      // ... insert into Supabase tables
      return { analysis, lotId, lotNumber };
    },
  });
}
```

---

# Hooks

Place composed hooks inside:

```txt
features/<feature>/hooks/use-<name>.ts
```

Hooks compose queries, mutations, and derived state. They do not call Supabase directly.

```ts
"use client";

import { useCreateBatchWithQcMutation } from "../queries/qc-queries";

export function useQc() {
  const createBatchWithQcMutation = useCreateBatchWithQcMutation();

  return {
    createBatchWithQc: createBatchWithQcMutation.mutateAsync,
    createBatchWithQcMutation,
    isProcessing: createBatchWithQcMutation.isPending,
  };
}
```

Only create a hooks folder when composing multiple queries/mutations or deriving state. If a single query hook is sufficient, use it directly in the component.

---

# Actions

Only create `actions/` when using `"use server"`.

```ts
// features/qc/actions/grade-qc-action.ts
"use server";

export async function gradeQcAction(input: GradeQcInput) {
  // OpenAI logic with secret API key
}
```

Use actions for:

- OpenAI / AI requests
- Secret API keys
- Admin-only operations

Do not use actions for Supabase CRUD — use the browser client directly via React Query.

---

# Components

Feature components live inside:

```txt
features/<feature>/components/<component-name>.tsx
```

They are `"use client"` and contain the full UI + hook usage.

Shared UI primitives live in `src/components/ui/` and are reused across features.

Always use the shared `Button`, `Input`, and `Select` components. Do not create inline styled alternatives.

---

# Types

Create `features/<feature>/types/` only when types are shared across multiple files within the feature.

```ts
// features/qc/types/qc-types.ts
export type GradeQcInput = { ... };
export type InspectionAnalysis = { ... };
export type CreateBatchWithQcResult = { ... };
```

Prefer colocated types until reuse appears.

---

# Supabase

Always use the singleton browser client:

```ts
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const supabase = getSupabaseBrowserClient();
```

Never instantiate clients inside components or pages.

This project does NOT use:

- Supabase Edge Functions
- `supabase/functions/`
- `Deno.serve(...)`

---

# Server-Side Architecture

Do not use `src/app/api/` route handlers for internal workflows.

Only create route handlers for:

- Webhooks
- Third-party callbacks
- Public endpoints consumed outside the app

For everything else, use Server Actions (`"use server"`).

---

# Styling

- Tailwind CSS v4 (`@import "tailwindcss"` in globals.css)
- Dark theme (zinc-950 backgrounds, zinc-100 text, blue-400 accents)
- Industrial / manufacturing aesthetic
- Font: Geist Sans + Geist Mono

Preferred palette:

```txt
Background: zinc-950, zinc-900
Surface: zinc-800, zinc-800/50
Border: zinc-700/50
Text: zinc-100, zinc-200, zinc-300
Muted: zinc-400
Accent: blue-400, blue-500
Warning: amber-400
Error: red-400
```

Preferred radius:

```txt
rounded-lg (tables, cards)
```

---

# Forms

Use React Hook Form + Zod + zodResolver + Sonner.

```ts
const form = useForm({ resolver: zodResolver(schema) });
```

Use `toast.promise(...)` for async form submissions.

---

# Notifications

Use Sonner exclusively:

```ts
toast.success(...);
toast.error(...);
toast.promise(promise, { loading, success, error });
```

---

# Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Query hooks | `use<Entity>Query` | `useLotsQuery()` |
| Mutation hooks | `use<Action>Mutation` | `useCreateBatchWithQcMutation()` |
| Composed hooks | `use<Feature>` | `useQc()`, `useAuth()` |
| Components | PascalCase | `IncomingLotsTable` |
| Files | kebab-case | `lots-queries.ts` |
| Folders | kebab-case | `features/lots/` |
| Server actions | `<verb><Entity>Action` | `gradeQcAction()` |

---

# Database

Supabase PostgreSQL with migrations managed via Supabase CLI.

```txt
supabase/
└── migrations/
    └── 20260527032943_create_batch_tables.sql
```

Tables: `suppliers`, `lots`, `qc_inspections`, `batch_events`

All tables have RLS enabled. Policies allow authenticated users to read all records and insert their own.

---

# General Rules

- Pages are thin wrappers — logic lives in features.
- Prefer React Query over manual async state.
- Prefer Supabase browser client over API routes.
- Prefer Server Actions over API routes for AI workflows.
- Keep feature code inside feature folders.
- Reuse existing UI components.
- Do not introduce new architectural patterns without justification.
- Match the existing dark industrial theme.
- Keep implementations simple and minimal.

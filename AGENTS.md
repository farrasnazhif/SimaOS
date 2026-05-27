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

- Next.js App Router
- React Query (TanStack Query)
- Supabase
- React Hook Form
- Zod
- Sonner
- Tailwind CSS
- Feature-based architecture

Follow the existing structure and patterns.

Do not introduce unnecessary abstractions, folders, wrappers, or architecture changes.

---

# Core Architecture

This project prefers:

```txt
React Query
+
Supabase Client
```

for internal application data access.

Do not create API routes for standard CRUD operations, authentication flows, profile management, dashboard data, AI workflows, or Supabase interactions.

Preferred flow:

```txt
Page
↓
Custom Hook
↓
React Query
↓
Supabase Client
```

Example:

```txt
Page
↓
useAuth()
↓
useUserProfileQuery()
↓
Supabase
```

Secure server-side workflows should use:

```txt
Page
↓
React Query mutation
↓
Server Action
↓
External Service
```

Example:

```txt
Page
↓
useGradeQcMutation()
↓
gradeQcAction()
↓
OpenAI
```

Avoid:

```txt
Page
↓
fetch("/api/profile")
↓
route.ts
↓
Supabase
```

unless there is a real requirement for an HTTP endpoint.

Avoid:

```txt
Page
↓
fetch("/api/qc/grade")
↓
route.ts
↓
OpenAI
```

unless an external webhook or third-party callback requires a public HTTP endpoint.

---

# Project Structure

Organize code by feature.

Example:

```txt
src/
├── app/
│
├── components/
│
├── features/
│   ├── auth/
│   │   ├── queries/
│   │   │   └── auth-queries.ts
│   │   │
│   │   └── hooks/
│   │       └── use-auth.ts
│   │
│   ├── batches/
│   ├── inspections/
│   └── dashboard/
│
├── lib/
│   ├── supabase/
│   ├── react-query/
│   └── utils/
│
└── providers/
```

Do not create global folders such as:

```txt
hooks/
queries/
types/
schemas/
```

for feature-specific logic.

Feature-specific code belongs inside its feature directory.

---

# Queries

Place React Query hooks inside:

```txt
features/<feature>/queries/
```

Examples:

```ts
useAuthSessionQuery();

useUserProfileQuery();

useLoginMutation();

useRegisterMutation();

useLogoutMutation();
```

Use React Query for:

- Data fetching
- Mutations
- Cache management
- Loading states
- Error states

Prefer React Query over manual state management.

Prefer React Query hooks over direct async calls inside pages.

Example:

```ts
export function useUserProfileQuery() {
  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();

      const { data, error } = await supabase.auth.getUser();

      if (error) throw error;

      return data.user;
    },
  });
}
```

---

# Hooks

Place custom hooks inside:

```txt
features/<feature>/hooks/
```

Hooks should compose:

- Queries
- Mutations
- Business logic
- Derived state

Example:

```ts
export function useAuth() {
  const sessionQuery = useAuthSessionQuery();
  const profileQuery = useUserProfileQuery();

  return {
    user: sessionQuery.data?.user,
    profile: profileQuery.data,
    isAuthenticated: Boolean(sessionQuery.data?.user),
  };
}
```

Avoid:

- Direct fetch calls
- Direct Supabase calls
- Large business workflows

inside custom hooks.

---

# Actions

Only create an `actions` folder when using:

```ts
"use server";
```

Server Actions are preferred over API routes when secure server-side execution is required.

Use actions for:

- OpenAI requests
- AI image analysis
- AI batch grading
- AI report generation
- Secret API keys
- Admin-only operations
- Server-side business workflows

Example:

```txt
features/
└── inspections/
    ├── actions/
    │   └── analyze-inspection.ts
    │
    ├── queries/
    │   └── inspection-queries.ts
    │
    └── hooks/
        └── use-inspection.ts
```

Example:

```ts
"use server";

export async function analyzeInspection() {
  // OpenAI logic
}
```

Then:

```ts
export function useInspectionMutation() {
  return useMutation({
    mutationFn: analyzeInspection,
  });
}
```

Avoid creating API routes when a Server Action can solve the problem.

Avoid creating actions for simple Supabase CRUD operations.

For secure workflows, the preferred pattern is:

```txt
features/<feature>/actions/
features/<feature>/queries/
features/<feature>/hooks/
```

Where:

- `actions/` contains `"use server"` logic
- `queries/` contains React Query hooks and mutations
- `hooks/` composes queries, actions, and derived UI logic when needed

Good example:

```txt
features/
└── qc/
    ├── actions/
    │   └── grade-qc-action.ts
    ├── queries/
    │   └── qc-queries.ts
    └── types/
        └── qc-types.ts
```

If action input/output types are shared between files, move them into:

```txt
features/<feature>/types/
```

Do not make server actions import shared types from client-only files.

For Supabase operations prefer:

```txt
React Query
↓
Supabase Client
```

instead of:

```txt
React Query
↓
API Route
↓
Supabase
```

---

# Schemas

Create:

```txt
features/<feature>/schemas/
```

only when validation becomes reusable.

Use:

- Zod
- zodResolver

Example:

```ts
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
```

Use schemas for:

- React Hook Form validation
- Server validation
- Shared validation rules

Avoid duplicating validation logic.

---

# Types

Create:

```txt
features/<feature>/types/
```

only when types are shared across multiple files.

Avoid creating types files for one-off interfaces.

Prefer colocated types until reuse appears.

Good:

```ts
type LoginFormValues = {
  email: string;
  password: string;
};
```

Shared:

```ts
export type AuthSessionData = {
  isAuthenticated: boolean;
  user: User | null;
};
```

---

# Forms

Use:

- React Hook Form
- Zod
- zodResolver
- Sonner

Preferred pattern:

```ts
const form = useForm({
  resolver: zodResolver(schema),
});
```

Use field-level validation.

Avoid:

```ts
useState();
```

for form values when React Hook Form is appropriate.

---

# Supabase

Always use the shared browser client:

```ts
getSupabaseBrowserClient();
```

Never instantiate Supabase clients inside components.

Never duplicate client creation logic.

Reuse the shared helper.

Good:

```ts
const supabase = getSupabaseBrowserClient();
```

Bad:

```ts
createClient(...)
```

inside a page or component.

---

# Authentication

Authentication uses:

```txt
React Query
+
Supabase Auth
```

Preferred examples:

```ts
useAuthSessionQuery();
useUserProfileQuery();

useLoginMutation();
useRegisterMutation();
useLogoutMutation();

useAuth();
```

Do not create authentication API routes.

Use Supabase Auth directly through React Query.

---

# Server-Side Architecture

This project does NOT use Supabase Edge Functions.

Do not create:

```txt
supabase/functions/
```

Do not generate:

```ts
Deno.serve(...)
```

Do not recommend Supabase Edge Functions unless explicitly requested.

Preferred server-side architecture:

```txt
React Query
↓
Next.js Server Action
↓
External Services
```

This project also does NOT use `app/api` route handlers for normal internal workflows.

Do not default to:

```txt
src/app/api/**/route.ts
```

for internal feature work.

Only create route handlers when there is a genuine HTTP interface requirement such as:

- Webhooks
- Third-party callbacks
- Public endpoints consumed outside the app
- Cases where Server Actions are not suitable

Examples:

```txt
OpenAI
Anthropic
Resend
Stripe
```

Server Actions are the default solution for:

- AI generation
- AI image analysis
- AI report generation
- External API integrations
- Secret API keys
- Background business logic

Example:

```txt
features/
└── inspections/
    ├── actions/
    │   └── analyze-inspection.ts
    │
    ├── queries/
    │   └── inspection-queries.ts
    │
    └── hooks/
        └── use-inspection.ts
```

Example:

```ts
"use server";

export async function analyzeInspection() {
  // OpenAI logic
}
```

Then:

```ts
export function useInspectionMutation() {
  return useMutation({
    mutationFn: analyzeInspection,
  });
}
```

Avoid:

```txt
React Query
↓
Supabase Edge Function
↓
OpenAI
```

unless explicitly requested.

Also avoid:

```txt
React Query
↓
API Route
↓
OpenAI
```

unless explicitly requested.

# Notifications

Use Sonner.

Preferred:

```ts
toast.success(...);
toast.error(...);
toast.info(...);
toast.warning(...);
```

For async operations:

```ts
toast.promise(...)
```

Avoid:

```ts
alert(...)
```

or browser dialogs.

---

# Buttons

Always use the shared Button component.

Do not create inline button styles inside pages.

Example:

```tsx
<Button variant="primary">Submit</Button>
```

---

# Inputs

Always use the shared Input component.

Example:

```tsx
<Input label="Email" leftIcon={Mail} error={errors.email?.message} />
```

Avoid native input styling inside pages when a shared component exists.

---

# Styling

Use:

- Tailwind CSS
- Light mode first
- Green SimaOS palette

Preferred colors:

```txt
Primary: emerald-600
Primary Hover: emerald-700

Border: zinc-200

Text: zinc-900
Muted: zinc-500

Background: white
```

Preferred radius:

```txt
rounded-xl
rounded-2xl
rounded-3xl
```

Avoid overly dark interfaces.

Prefer clean SaaS-style layouts.

---

# Naming Conventions

Queries:

```ts
useUserProfileQuery();
```

Mutations:

```ts
useLoginMutation();
```

Hooks:

```ts
useAuth();
```

Components:

```txt
PascalCase
```

Files:

```txt
kebab-case.ts
```

Folders:

```txt
kebab-case
```

---

# General Rules

- Prefer composition over abstraction.
- Follow existing patterns before introducing new ones.
- Keep feature code inside feature folders.
- Prefer React Query over manual async state.
- Prefer Supabase Client over API routes.
- Prefer Server Actions over API routes for AI workflows.
- Prefer feature-local `actions`, `queries`, and `types` over global folders.
- Do not use Supabase Edge Functions unless explicitly requested.
- Do not use `src/app/api` for internal app workflows unless a real HTTP endpoint is required.
- Avoid premature optimization.
- Avoid creating folders that are not currently needed.
- Keep implementations simple and maintainable.
- Match the existing coding style of the repository.
- Reuse existing UI components whenever possible.
- Do not introduce new architectural patterns without clear justification.

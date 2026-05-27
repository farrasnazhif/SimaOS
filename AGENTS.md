<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Overview

This project uses:

- Next.js App Router

- React Query (TanStack Query)

- Supabase

- React Hook Form

- Tailwind CSS

- Feature-based architecture

Follow the existing structure and patterns. Do not introduce unnecessary abstractions or folders.

---

# Project Structure

Organize code by feature.

Example:

```txt

src/

├── app/

├── components/

├── features/

│   ├── auth/

│   │   ├── queries/

│   │   │   └── auth-queries.ts

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

Do not create global `hooks`, `queries`, or `types` folders for feature-specific logic.

Feature-specific code belongs inside its feature directory.

---

# Queries

Place React Query hooks inside:

```txt

features/<feature>/queries/

```

Example:

```ts
useAuthSessionQuery();

useUserProfileQuery();

useLoginMutation();

useRegisterMutation();

useLogoutMutation();
```

Use React Query for all async data fetching and mutations.

Prefer custom hooks over direct query usage inside pages.

---

# Hooks

Place custom hooks inside:

```txt

features/<feature>/hooks/

```

Hooks should compose existing queries and business logic.

Example:

```ts
useAuth();
```

Good:

```ts
export function useAuth() {
  const sessionQuery = useAuthSessionQuery();

  return {
    user: sessionQuery.data?.user,

    isAuthenticated: Boolean(sessionQuery.data?.user),
  };
}
```

Avoid placing API calls directly inside these hooks.

---

# Actions

Only create an `actions` folder if using:

```ts
"use server";
```

or when business logic becomes large enough to justify extraction.

Do not create actions for simple React Query + Supabase operations.

---

# Schemas

Create:

```txt

features/<feature>/schemas/

```

only when validation becomes reusable.

Use Zod.

Example:

```ts
export const LoginSchema = z.object({
  email: z.email(),

  password: z.string().min(6),
});
```

---

# Types

Create:

```txt

features/<feature>/types/

```

only when types are shared across multiple files.

Avoid creating types files for one-off interfaces.

Prefer colocated types until reuse appears.

---

# Forms

Use:

- React Hook Form

- Zod Resolver

- Sonner for feedback

Pattern:

```ts
const form = useForm({
  resolver: zodResolver(schema),
});
```

Use field-level validation.

Do not use local state for form values unless necessary.

---

# Supabase

Use the shared browser client:

```ts
getSupabaseBrowserClient();
```

Never instantiate Supabase clients inside components.

Always reuse the shared client helper.

---

# Styling

Use:

- Tailwind CSS

- Light mode first

- Green SimaOS color palette

Preferred colors:

```txt

Primary: emerald-600

Hover: emerald-700

Border: zinc-200

Text: zinc-900

Muted: zinc-500

Background: white

```

Prefer:

```txt

rounded-xl

rounded-2xl

rounded-3xl

```

Avoid overly dark UI.

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

---

# Notifications

Use Sonner.

Preferred patterns:

```ts

toast.success(...)

toast.error(...)

toast.info(...)

```

For async operations:

```ts

toast.promise(...)

```

Avoid browser alerts.

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

---

# General Rules

- Prefer composition over abstraction.

- Follow existing patterns before introducing new ones.

- Keep feature code inside feature folders.

- Avoid premature optimization.

- Avoid creating folders that are not currently needed.

- Keep implementations simple and maintainable.

- Match the existing coding style of the repository.

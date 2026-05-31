import { type ReactNode } from "react";

export default function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h1 className="text-4xl font-semibold text-zinc-900">{title}</h1>
        {description && <p className="mt-1 text-base text-zinc-700">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

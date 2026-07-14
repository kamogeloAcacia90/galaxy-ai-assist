import type { ReactNode } from "react";

export function PageHeader({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-galaxy text-primary-foreground glow">
        {icon}
      </div>
      <div>
        <h1 className="font-display text-3xl font-bold text-galaxy">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

export function LogoRankMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-7", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" className="fill-foreground" />
      <rect x="7" y="19" width="18" height="6" rx="1.4" className="fill-background" />
      <rect x="10" y="11.5" width="12" height="4.5" rx="1.1" className="fill-background" />
      <rect x="13" y="5.5" width="6" height="3.2" rx="0.9" className="fill-background" />
    </svg>
  );
}

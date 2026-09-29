import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: "md" | "lg";
  external?: boolean;
  className?: string;
  icon?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-fog-50 text-ink-950 hover:bg-white shadow-[0_0_0_1px_rgb(255_255_255/0.2),0_10px_36px_-10px_rgb(77_124_255/0.6)]",
  secondary: "bg-white/[0.04] text-fog-100 ring-1 ring-inset ring-white/12 hover:bg-white/[0.08] hover:ring-white/20",
  ghost: "text-fog-100 hover:text-white",
};

export function Button({ href, children, variant = "primary", size = "md", external, className, icon = true }: ButtonProps) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-[background-color,box-shadow,color,transform] duration-300 active:scale-[0.98]",
    variant === "ghost" ? "h-auto px-0 text-sm" : size === "lg" ? "h-13 px-7 text-[0.98rem]" : "h-11 px-5 text-sm",
    variants[variant],
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <Icon
          aria-hidden
          className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-px"
        />
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

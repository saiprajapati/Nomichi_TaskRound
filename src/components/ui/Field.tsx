import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from "react";

const fieldBase =
  "w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-base text-ink placeholder:text-ink/40 transition-colors duration-150 focus:border-rust focus:outline-none disabled:bg-ink/5 disabled:text-ink/40";
const fieldError = "border-rust/60";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  ({ className, invalid, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, invalid && fieldError, className)} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <textarea ref={ref} className={cn(fieldBase, "min-h-28 resize-y", invalid && fieldError, className)} {...props} />
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <select ref={ref} className={cn(fieldBase, "appearance-none", invalid && fieldError, className)} {...props} />
));
Select.displayName = "Select";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-ink/50">{hint}</p>}
      {error && <p className="text-xs text-rust">{error}</p>}
    </div>
  );
}

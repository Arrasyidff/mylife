"use client";
import { forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, showToggle, showPassword, onTogglePassword, className, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold tracking-[0.02em] text-zinc-500 ml-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-[#1a1a1a]",
              "placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none transition-colors",
              showToggle && "pr-10",
              className
            )}
            {...props}
          />
          {showToggle && onTogglePassword && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export { FormInput };

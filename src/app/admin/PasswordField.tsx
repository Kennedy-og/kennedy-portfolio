"use client";

import { useState } from "react";

type PasswordFieldProps = {
  id: string;
  name: string;
  defaultValue?: string;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
};

export function PasswordField({
  id,
  name,
  defaultValue,
  autoComplete,
  placeholder,
  className = "",
  required = false,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        className={`w-full rounded-xl border border-white/10 bg-[#181b1e] px-3 py-2.5 pr-11 text-sm text-white placeholder:text-neutral-400 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10 ${className}`}
      />
      <button
        type="button"
        aria-label={showPassword ? "Hide password" : "Show password"}
        onClick={() => setShowPassword((current) => !current)}
        className="absolute inset-y-0 right-3 flex items-center justify-center text-neutral-400 transition hover:text-white"
      >
        {showPassword ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.58 10.58A2 2 0 0013.4 13.4M9.88 5.13A10.95 10.95 0 0112 5c4.97 0 9.17 2.9 11 7-1.02 2.12-2.53 3.86-4.36 5.05M14.12 18.87A10.9 10.9 0 0112 19c-4.97 0-9.17-2.9-11-7 .78-1.62 1.9-2.99 3.3-4.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}

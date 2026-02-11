"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PermissionButtonProps {
  onClick: () => void;
  /** If set, button is rendered disabled with this tooltip text. */
  disabledReason?: string | null;
  /** If true, renders nothing (used for Viewer role). */
  hidden?: boolean;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
}

/**
 * A button that:
 * - Renders nothing when `hidden` is true (Viewer role).
 * - Is disabled with a hover tooltip when `disabledReason` is set (Manager role).
 * - Is fully interactive otherwise.
 */
export function PermissionButton({
  onClick,
  disabledReason,
  hidden,
  className,
  children,
  type = "button",
}: PermissionButtonProps) {
  if (hidden) return null;

  const isDisabled = !!disabledReason;

  return (
    // Wrapper span handles hover even when button is disabled
    <span className="relative group/pbtn inline-flex">
      <button
        type={type}
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        className={cn(className, isDisabled && "opacity-50 cursor-not-allowed")}
      >
        {children}
      </button>
      {isDisabled && disabledReason && (
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/pbtn:block z-50 whitespace-nowrap rounded bg-gray-900 px-2.5 py-1 text-xs text-white shadow-lg">
          {disabledReason}
          {/* Caret */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  );
}

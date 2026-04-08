"use client";

export function GlitchText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={`text-glitch glitch-hover ${className}`}
      data-text={children}
    >
      {children}
    </span>
  );
}

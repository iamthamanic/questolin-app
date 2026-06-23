/**
 * Questolin mascot SVG — idle, thinking, happy states (v1, no animation).
 * Location: components/tutor/QuestolinMascot.tsx
 */

export type MascotState = "idle" | "thinking" | "happy";

interface QuestolinMascotProps {
  state?: MascotState;
  size?: number;
  className?: string;
}

export function QuestolinMascot({
  state = "idle",
  size = 48,
  className = "",
}: QuestolinMascotProps) {
  const mouth =
    state === "happy"
      ? "M16 28 Q20 32 24 28"
      : state === "thinking"
        ? "M16 29 L24 29"
        : "M16 28 Q20 26 24 28";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      role="img"
      aria-label="Questolin"
      className={className}
    >
      <circle cx="20" cy="20" r="18" className="fill-primary" />
      <circle cx="14" cy="17" r="2.5" className="fill-primary-content" />
      <circle cx="26" cy="17" r="2.5" className="fill-primary-content" />
      <path
        d={mouth}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="stroke-primary-content"
      />
    </svg>
  );
}

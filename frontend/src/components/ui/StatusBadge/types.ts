export type StatusTone = "neutral" | "ok" | "down";

export type StatusBadgeProps = {
  label: string;
  tone: StatusTone;
};

import type { STATUS_TONES } from "./config";

export type StatusTone = (typeof STATUS_TONES)[keyof typeof STATUS_TONES];

export type StatusBadgeProps = {
  label: string;
  tone: StatusTone;
};

import { useIntl } from "../../../../hooks/use-intl";
import { AiReadyBadge } from "../badges/ai-ready-badge";
import { AvailableNowBadge } from "../badges/available-now-badge";
import { ContractBadge } from "../badges/contract-badge";
import { FullTimeBadge } from "../badges/full-time-badge";
import { RelocationBadge } from "../badges/relocation-badge";
import { RemoteWorkBadge } from "../badges/remote-work-badge";
import { STATUS_BADGE_KINDS } from "./config";
import styles from "./styles.module.css";
import type { AboutStatusBadgesProps } from "./types";

/** The row of status badges at the top of About: each kind has its own drawing. */
export function AboutStatusBadges({ badges }: AboutStatusBadgesProps) @{
  const intl = useIntl();

  <ul class={styles["about-status-badges"]}>
    @for (const badge of badges; key badge.kind) {
      <li class={styles["about-status-badges__item"]}>
        @switch (badge.kind) {
          @case STATUS_BADGE_KINDS.availableNow: {
            <AvailableNowBadge
              text={intl.formatMessage({ id: badge.text })}
              title={intl.formatMessage({ id: badge.title })}
            />;
          }
          @case STATUS_BADGE_KINDS.fullTime: {
            <FullTimeBadge
              text={intl.formatMessage({ id: badge.text })}
              title={intl.formatMessage({ id: badge.title })}
            />;
          }
          @case STATUS_BADGE_KINDS.contract: {
            <ContractBadge
              text={intl.formatMessage({ id: badge.text })}
              title={intl.formatMessage({ id: badge.title })}
            />;
          }
          @case STATUS_BADGE_KINDS.relocation: {
            <RelocationBadge
              text={intl.formatMessage({ id: badge.text })}
              title={intl.formatMessage({ id: badge.title })}
            />;
          }
          @case STATUS_BADGE_KINDS.remoteWork: {
            <RemoteWorkBadge
              text={intl.formatMessage({ id: badge.text })}
              title={intl.formatMessage({ id: badge.title })}
            />;
          }
          @case STATUS_BADGE_KINDS.aiReady: {
            <AiReadyBadge
              text={intl.formatMessage({ id: badge.text })}
              title={intl.formatMessage({ id: badge.title })}
            />;
          }
        }
      </li>;
    }
  </ul>;
}

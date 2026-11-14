import { useIntl } from "../../../../hooks/useIntl";
import { AiReadyBadge } from "./components/AiReadyBadge";
import { AvailableNowBadge } from "./components/AvailableNowBadge";
import { ContractBadge } from "./components/ContractBadge";
import { FullTimeBadge } from "./components/FullTimeBadge";
import { RelocationBadge } from "./components/RelocationBadge";
import { RemoteWorkBadge } from "./components/RemoteWorkBadge";
import styles from "./styles.module.css";
import type { AvailabilityBadgesProps } from "./types";

/** The row of availability badges at the top of About: each kind has its own drawing. */
export function AvailabilityBadges({ badges }: AvailabilityBadgesProps) @{
  const intl = useIntl();

  <ul class={styles["availability-badges"]}>
    @for (const badge of badges; key badge.kind) {
      <li class={styles["availability-badges__item"]}>
        @switch (badge.kind) {
          @case "availableNow": {
            <AvailableNowBadge
              text={intl.formatMessage({ id: badge.text })}
              title={intl.formatMessage({ id: badge.title })}
            />;
          }
          @case "fullTime": {
            <FullTimeBadge
              text={intl.formatMessage({ id: badge.text })}
              title={intl.formatMessage({ id: badge.title })}
            />;
          }
          @case "contract": {
            <ContractBadge
              text={intl.formatMessage({ id: badge.text })}
              title={intl.formatMessage({ id: badge.title })}
            />;
          }
          @case "relocation": {
            <RelocationBadge
              text={intl.formatMessage({ id: badge.text })}
              title={intl.formatMessage({ id: badge.title })}
            />;
          }
          @case "remoteWork": {
            <RemoteWorkBadge
              text={intl.formatMessage({ id: badge.text })}
              title={intl.formatMessage({ id: badge.title })}
            />;
          }
          @case "aiReady": {
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

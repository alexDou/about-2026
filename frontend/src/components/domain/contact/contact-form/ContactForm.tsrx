import "altcha";
import { useEffect, useRef } from "octane";
import { API_HEALTH, useApiHealth } from "../../api-status";
import { useIntl } from "../../../../hooks/use-intl";
import { CONTACT_CHALLENGE_URL, CONTACT_LIMITS } from "../../../../services/api";
import { Countdown } from "../../../ui/countdown";
import { INPUT_FIELD_LAYOUTS, INPUT_FIELD_TONES, InputField } from "../../../ui/input-field";
import {
  CONTACT_FIELDS,
  FIELD_ERROR,
  FORM_NOTICE,
  FORM_STATUS,
  HUMAN_CHECK_WIDGET,
  RETRY_SECONDS,
} from "./config";
import { useContactForm } from "./hooks/use-contact-form";
import styles from "./styles.module.css";
import type { ContactFieldName, ContactFormProps } from "./types";
import { characterCount, showsCounter } from "./utils";

/**
 * The Contact request form. While it sends, the fields and the button are disabled; once it is
 * sent, a thank-you note replaces it. A request that fails brings the form back as it was.
 *
 * Two things stop bots without bothering the Visitor: the ALTCHA widget, which takes the first
 * submit, solves its proof of work invisibly and submits again with the payload, and a hidden
 * honeypot field that only a bot fills.
 */
export function ContactForm({ content }: ContactFormProps) @{
  const intl = useIntl();
  const {
    values,
    status,
    errors,
    notice,
    valid,
    retryLocked,
    endRetryLock,
    focusRequest,
    sentName,
    website,
    humanCheckRound,
    setValue,
    setWebsite,
    changeHumanCheck,
    leaveField,
    submit,
  } = useContactForm();
  const sending = status === FORM_STATUS.sending;
  // With the backend down nothing can be sent: the form waits, keeping what was typed.
  const offline = useApiHealth() === API_HEALTH.down;
  // When the backend refuses a field, the first one it names takes the focus.
  const inputs = useRef<Partial<Record<ContactFieldName, HTMLInputElement | null>>>({});
  useEffect(() => {
    if (focusRequest) inputs.current[focusRequest.field]?.focus();
  }, [focusRequest]);

  // A form that is replaced by its thank-you note takes the focus with it, so the note is read out.
  const thanks = useRef<HTMLOutputElement | null>(null);
  useEffect(() => {
    if (status === FORM_STATUS.sent) thanks.current?.focus();
  }, [status]);

  const errorText = (field: ContactFieldName) => {
    const error = errors[field];
    if (error === FIELD_ERROR.tooLong) {
      return intl.formatMessage({ id: content.tooLong }, { max: CONTACT_LIMITS[field] });
    }
    const required = content.fields[field].requiredError;
    return error && required ? intl.formatMessage({ id: required }) : undefined;
  };

  @if (status === FORM_STATUS.sent) {
    <output
      class={styles["contact-form__thanks"]}
      tabIndex={-1}
      ref={(element) => {
        thanks.current = element;
      }}
    >
      {intl.formatMessage({ id: content.thanks }, { name: sentName }) as string}
    </output>;
  } @else {
    <form class={styles["contact-form"]} onSubmit={submit} noValidate>
      <fieldset class={styles["contact-form__fields"]} disabled={sending || offline}>
        @for (const field of CONTACT_FIELDS; key field.name) {
          <InputField
            name={field.name}
            label={intl.formatMessage({ id: content.fields[field.name].label })}
            hint={
              content.fields[field.name].hint
                ? intl.formatMessage({ id: content.fields[field.name].hint })
                : undefined
            }
            required={field.required}
            layout={INPUT_FIELD_LAYOUTS.inline}
            tone={INPUT_FIELD_TONES.dark}
            autoComplete={field.autoComplete}
            error={errorText(field.name)}
            counter={
              showsCounter(field.name, values[field.name])
                ? intl.formatMessage(
                    { id: content.counter },
                    {
                      count: characterCount(values[field.name]),
                      max: CONTACT_LIMITS[field.name],
                    },
                  )
                : undefined
            }
            value={values[field.name]}
            onValueInput={(value) => setValue(field.name, value)}
            onLeave={() => leaveField(field.name)}
            inputRef={(input) => {
              inputs.current[field.name] = input;
            }}
          />;
        }
        // Not `display: none` alone: `hidden` and `aria-hidden` keep it from every Visitor, and
        // `autocomplete="off"` keeps a browser from filling it.
        <div class={styles["contact-form__honeypot"]} hidden aria-hidden="true">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onInput={(event) => setWebsite((event.target as HTMLInputElement).value)}
          />
        </div>
        <altcha-widget
          key={humanCheckRound}
          class={styles["contact-form__human-check"]}
          challenge={CONTACT_CHALLENGE_URL}
          auto={HUMAN_CHECK_WIDGET.auto}
          display={HUMAN_CHECK_WIDGET.display}
          onstatechange={changeHumanCheck}
        />
        @if (notice === FORM_NOTICE.invalidFields) {
          <p class={styles["contact-form__notice"]} role="alert">
            {intl.formatMessage({ id: content.invalid })}
          </p>;
        }
        @if (notice === FORM_NOTICE.failed) {
          // Only the first sentence is read out. The seconds change every second and are not.
          <div class={styles["contact-form__notice"]}>
            <p role="alert">{intl.formatMessage({ id: content.failed })}</p>
            <p>
              @if (retryLocked) {
                <Countdown
                  from={RETRY_SECONDS}
                  format={(seconds) =>
                    intl.formatMessage({ id: content.retryIn }, { seconds })
                  }
                  onDone={endRetryLock}
                />;
              } @else {
                <>{intl.formatMessage({ id: content.retryNow })}</>;
              }
            </p>
          </div>;
        }
      </fieldset>
      <button
        class={styles["contact-form__send"]}
        type="submit"
        disabled={sending || offline || retryLocked || !valid}
      >
        {intl.formatMessage({ id: sending ? content.sending : content.send })}
      </button>
    </form>;
  }
}

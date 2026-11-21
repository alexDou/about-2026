import { useEffect, useRef } from "octane";
import { API_HEALTH, useApiHealth } from "../../api-status";
import { useIntl } from "../../../../hooks/use-intl";
import { CONTACT_LIMITS } from "../../../../services/api";
import { Icon, ICON_SIZES } from "../../../ui/icon";
import { INPUT_FIELD_LAYOUTS, INPUT_FIELD_TONES, InputField } from "../../../ui/input-field";
import { CONTACT_FIELDS, FIELD_ERROR, FORM_NOTICE, FORM_STATUS } from "./config";
import { useContactForm } from "./hooks/use-contact-form";
import styles from "./styles.module.css";
import type { ContactFieldName, ContactFormProps } from "./types";
import { characterCount, showsCounter } from "./utils";

/**
 * The Contact request form. While it sends, the fields and the button are disabled; once it is
 * sent, a thank-you note replaces it. A request that fails brings the form back as it was.
 */
export function ContactForm({ content, media }: ContactFormProps) @{
  const intl = useIntl();
  const {
    values,
    status,
    errors,
    notice,
    retryIn,
    focusRequest,
    sentName,
    setValue,
    leaveField,
    submit,
  } = useContactForm();
  const sending = status === FORM_STATUS.sending;
  // With the backend down nothing can be sent: the form waits, keeping what was typed.
  const offline = useApiHealth() === API_HEALTH.down;
  // After a failed attempt to send, the first invalid field takes the focus.
  const inputs = useRef<Partial<Record<ContactFieldName, HTMLInputElement | null>>>({});
  useEffect(() => {
    if (focusRequest) inputs.current[focusRequest.field]?.focus();
  }, [focusRequest]);

  const errorText = (field: ContactFieldName) => {
    const error = errors[field];
    if (error === FIELD_ERROR.tooLong) {
      return intl.formatMessage({ id: content.tooLong }, { max: CONTACT_LIMITS[field] });
    }
    const required = content.fields[field].requiredError;
    return error && required ? intl.formatMessage({ id: required }) : undefined;
  };

  @if (status === FORM_STATUS.sent) {
    <output class={styles["contact-form__thanks"]}>
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
        @if (notice === FORM_NOTICE.invalidFields) {
          <p class={styles["contact-form__notice"]} role="alert">
            {intl.formatMessage({ id: content.invalid })}
          </p>;
        }
        @if (notice === FORM_NOTICE.failed) {
          <p class={styles["contact-form__notice"]} role="alert">
            {retryIn > 0
              ? intl.formatMessage({ id: content.failed }, { seconds: retryIn })
              : intl.formatMessage({ id: content.failedNow })}
          </p>;
        }
      </fieldset>
      <button
        class={styles["contact-form__send"]}
        type="submit"
        disabled={sending || offline || retryIn > 0}
      >
        <Icon media={media.send} size={ICON_SIZES.small} />
        <span>{intl.formatMessage({ id: sending ? content.sending : content.send })}</span>
      </button>
    </form>;
  }
}

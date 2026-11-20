import { useIntl } from "../../../../hooks/use-intl";
import { ContactField } from "./contact-field";
import { CONTACT_FIELDS, FORM_STATUS } from "./config";
import { useContactForm } from "./hooks/use-contact-form";
import styles from "./styles.module.css";
import type { ContactFormProps } from "./types";

/**
 * The Contact request form. While it sends, the fields and the button are disabled; once it is
 * sent, a thank-you note replaces it. A request that fails brings the form back as it was.
 */
export function ContactForm({ content }: ContactFormProps) @{
  const intl = useIntl();
  const { values, status, sentName, setValue, submit } = useContactForm();
  const sending = status === FORM_STATUS.sending;

  @if (status === FORM_STATUS.sent) {
    <output class={styles["contact-form__thanks"]}>
      {intl.formatMessage({ id: content.thanks }, { name: sentName }) as string}
    </output>;
  } @else {
    <form class={styles["contact-form"]} onSubmit={submit} noValidate>
      <fieldset class={styles["contact-form__fields"]} disabled={sending}>
        @for (const field of CONTACT_FIELDS; key field.name) {
          <ContactField
            name={field.name}
            label={intl.formatMessage({ id: content.fields[field.name].label })}
            hint={
              content.fields[field.name].hint
                ? intl.formatMessage({ id: content.fields[field.name].hint })
                : undefined
            }
            required={field.required}
            autoComplete={field.autoComplete}
            value={values[field.name]}
            onValueInput={(value) => setValue(field.name, value)}
          />;
        }
        <p class={styles["contact-form__required"]}>
          {intl.formatMessage({ id: content.required })}
        </p>
      </fieldset>
      <button class={styles["contact-form__send"]} type="submit" disabled={sending}>
        {intl.formatMessage({ id: sending ? content.sending : content.send })}
      </button>
    </form>;
  }
}

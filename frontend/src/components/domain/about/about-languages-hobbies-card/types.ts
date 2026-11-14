import type { MessageId } from "../../../../i18n";

/** A spoken language: its name, the level in words and the CEFR level (none for a native one). */
export type CardLanguage = {
  name: MessageId;
  level: MessageId;
  cefr?: MessageId;
};

export type CardHobby = {
  name: MessageId;
  text: MessageId;
};

export type AboutLanguagesHobbiesCardProps = {
  headings: { languages: MessageId; hobbies: MessageId };
  /** How a language reads: "{name}: {level}", and with its "({cefr})". */
  languageLines: { plain: MessageId; withCefr: MessageId };
  languages: readonly CardLanguage[];
  hobbies: readonly CardHobby[];
};

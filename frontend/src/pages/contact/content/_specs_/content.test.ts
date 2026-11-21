import { describe, expect, it } from "vitest";
import { CONTACT_CONTENT } from "..";

describe("CONTACT_CONTENT", () => {
  it("links LinkedIn and then Xing, to the Owner's profiles", () => {
    expect(CONTACT_CONTENT.profiles.map(({ kind, url }) => [kind, url])).toEqual([
      ["linkedin", "https://www.linkedin.com/in/a-doo/"],
      ["xing", "https://www.xing.com/profile/Alexander_Doo"],
    ]);
  });

  it("reads every text from the Contact messages", () => {
    const ids = [
      CONTACT_CONTENT.title,
      CONTACT_CONTENT.subtitle,
      CONTACT_CONTENT.remote,
      CONTACT_CONTENT.notice,
      CONTACT_CONTENT.required,
      ...CONTACT_CONTENT.profiles.map(({ label }) => label),
    ];
    expect(ids.every((id) => id.startsWith("contact."))).toBe(true);
  });
});

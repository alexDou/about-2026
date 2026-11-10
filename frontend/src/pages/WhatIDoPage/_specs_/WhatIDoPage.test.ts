import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { intlWrapper } from "../../../i18n";
import { WhatIDoPage } from ".././WhatIDoPage.tsrx";

describe("WhatIDoPage", () => {
  it("shows only its heading, titled by the Panel's message", () => {
    const { container } = render(WhatIDoPage, { props: {}, wrapper: intlWrapper() });
    expect(screen.getByRole("heading", { level: 1, name: "What I do" })).toBeInTheDocument();
    expect(container).toHaveTextContent(/^What I do$/);
  });

  it("takes the heading from the messages", () => {
    render(WhatIDoPage, {
      props: {},
      wrapper: intlWrapper({ "board.panel.whatIDo.title": "Titel" }),
    });
    expect(screen.getByRole("heading", { name: "Titel" })).toBeInTheDocument();
  });
});

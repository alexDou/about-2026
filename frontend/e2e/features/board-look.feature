Feature: Default Board look

  Scenario: Panels carry their palette colours and text colours
    When I open "/explore"
    Then the Panel "About" is coloured "rgb(37, 54, 58)" with text "rgb(209, 220, 217)"
    And the Panel "What I do" is coloured "rgb(209, 220, 217)" with text "rgb(37, 54, 58)"
    And the Panel "Skills" is coloured "rgb(103, 179, 168)" with text "rgb(37, 54, 58)"
    And the Panel "Chat with me" is coloured "rgb(76, 131, 159)" with text "rgb(37, 54, 58)"
    And the Panel "Contact" is coloured "rgb(92, 139, 112)" with text "rgb(37, 54, 58)"

  Scenario: Titles are uppercase, wide-spaced, 1rem and in Overused Grotesk
    When I open "/explore"
    Then every Panel title is uppercase, spaced wide, 16px and in "Overused Grotesk"

  Scenario: Only What I do and Chat with me have a Sublabel
    When I open "/explore"
    Then the Sublabels read "36 Takeovers" and "AI agent trained on my data"
    And the Sublabels are not links

  Scenario: Desktop shows equal-width full-height columns
    Given the window is 1280 by 800
    When I open "/explore"
    Then the Panels are 5 equal columns filling the window
    And every Panel title is centred in its Panel

  Scenario: A short desktop window keeps the Board at least 32rem tall
    Given the window is 1280 by 400
    When I open "/explore"
    Then the Board is at least 512px tall

  Scenario Outline: Mobile shows equal-height full-width rows
    Given the window is <width> by <height>
    When I open "/explore"
    Then the Panels are 5 equal rows filling the window
    And every Panel title is centred in its Panel

    Examples:
      | width | height |
      | 375   | 667    |
      | 360   | 640    |
      | 320   | 568    |

  Scenario: A short mobile window keeps the Board at least 420px tall and the rows readable
    Given the window is 375 by 300
    When I open "/explore"
    Then the Board is at least 420px tall
    And every Panel is at least 80px tall

  Scenario: A narrow phone keeps the titles inside their rows
    Given the window is 320 by 568
    When I open "/explore"
    Then every Panel title fits inside its Panel

  Scenario: Narrow desktop columns keep the titles and Sublabels inside their Panels
    Given the window is 641 by 800
    When I open "/explore"
    Then every Panel title fits inside its Panel
    And every Sublabel fits inside its Panel

  Scenario: Sublabels fit in the shortest mobile rows
    Given the window is 320 by 300
    When I open "/explore"
    Then every Sublabel fits inside its Panel

  Scenario: Moving dots slide in above the title on hover and focus
    Given the window is 1280 by 800
    When I open "/explore"
    Then the dots above the Panel title "Skills" are hidden
    When I hover the Panel title "Skills"
    Then the dots above the Panel title "Skills" are shown
    And the dots above the Panel title "Skills" span the Panel and are at most 8px tall
    And the dots above the Panel title "Skills" end above the title, as far as the Sublabel is below
    And the dots above the Panel title "Skills" are moving
    When I move the pointer away
    And I focus the Panel title "Contact" with the keyboard
    Then the dots above the Panel title "Contact" are shown

  Scenario: No line crosses a title
    Given the window is 1280 by 800
    When I open "/explore"
    And I hover the Panel title "Skills"
    Then the dots above the Panel title "Skills" end above the title, as far as the Sublabel is below

  Scenario: The Board unfolds when the logo opens it
    Given I open the landing page
    When I click the logo
    Then the Board is unfolding
    And the Panel titles are hidden while the Panels unfold
    When the unfold has ended
    Then every Panel and title is fully shown

  Scenario: The Board does not unfold on a direct visit
    When I open "/explore"
    Then the Board is not unfolding
    And every Panel and title is fully shown

  Scenario: The Board does not unfold on Forward from the Landing
    Given I open the landing page
    When I click the logo
    And the unfold has ended
    And I go back
    And I go forward
    Then I am on "/explore"
    And the Board is not unfolding
    And every Panel and title is fully shown

  Scenario: With reduced motion the Board appears at once
    Given the visitor prefers reduced motion
    And I open the landing page
    When I click the logo
    Then the Board is not unfolding
    And every Panel and title is fully shown

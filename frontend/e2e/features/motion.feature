Feature: The Board's route changes play as View Transitions

  Background:
    Given the visitor accepts motion
    And I record the View Transitions

  Scenario: Opening a Panel on desktop resizes the slots, then fades the new views in
    Given the window is 1280 by 800
    And I open "/explore"
    And the unfold has ended
    When I click the Panel "Skills"
    Then a View Transition of type "open" plays
    And every slot and view resizes over 500ms, "ease-in-out"
    And no old view is shown
    And the Stripes fade in over 400ms after 500ms
    And the Expanded panel "Skills" fades in over 150ms after 500ms

  Scenario: Switching Panels on desktop only resizes the slots
    Given the window is 1280 by 800
    And I open "/skills"
    And the unfold has ended
    When I click the Panel "Contact"
    Then a View Transition of type "switch" plays
    And every slot and view resizes over 500ms, "ease-in-out"
    And no old view is shown
    And no view fades in

  Scenario: Closing on desktop resizes the slots, then fades the Panels in
    Given the window is 1280 by 800
    And I open "/contact"
    And the unfold has ended
    When I click the close button "Close Contact"
    Then a View Transition of type "close" plays
    And every slot and view resizes over 500ms, "ease-in-out"
    And no old view is shown
    And every Panel fades in over 120ms after 500ms

  Scenario: Escape closes with the same View Transition
    Given the window is 1280 by 800
    And I open "/about"
    And the unfold has ended
    When I press Escape
    Then a View Transition of type "close" plays
    And every slot and view resizes over 500ms, "ease-in-out"
    And every Panel fades in over 120ms after 500ms

  Scenario: On a phone open, switch and close only resize the slots
    Given the window is 375 by 667
    And I open "/explore"
    And the unfold has ended
    When I click the Panel "Skills"
    Then a View Transition of type "open" plays
    And every slot and view resizes over 500ms, "ease-in-out"
    And no old view is shown
    And no view fades in
    When I click the Panel "Contact"
    Then a View Transition of type "switch" plays
    And no view fades in
    When I click the close button "Close Contact"
    Then a View Transition of type "close" plays
    And every slot and view resizes over 500ms, "ease-in-out"
    And no view fades in

  Scenario: Leaving the Board for the Landing plays no View Transition
    Given I open the landing page
    When I click the logo
    And the unfold has ended
    And I go back
    Then the logo is shown
    And no View Transition has played

  Scenario: With reduced motion every route change is instant
    Given the visitor prefers reduced motion
    And the window is 1280 by 800
    And I open "/explore"
    When I click the Panel "Skills"
    Then a View Transition of type "open" plays
    And nothing animates in it
    And the page heading reads "Skills"
    When I click the Panel "Contact"
    Then a View Transition of type "switch" plays
    And nothing animates in it
    When I click the close button "Close Contact"
    Then a View Transition of type "close" plays
    And nothing animates in it
    And the Board lists the five Panels

Feature: Animated logo

  Background:
    Given I open the landing page

  Scenario: The logo is animated
    Then the logo weave moves over time

  Scenario: Hovering the logo changes its style
    Then the logo shows a pointer cursor
    And the logo ring uses the color "#5ddccb"
    When I hover over the logo
    Then the logo ring uses the color "#f87269"

  Scenario: Clicking the logo logs a message
    When I click the logo
    Then the console logs "logo clicked"

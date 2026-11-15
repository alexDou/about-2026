Feature: Site shell

  Scenario: Search engines are told not to index the site
    Given I open the landing page
    Then the page asks robots for "noindex, nofollow"

  Scenario: robots.txt keeps AI-training crawlers out
    When I fetch "/robots.txt"
    Then the response disallows "GPTBot" and "ClaudeBot"
    And the response lets "*" in

  Scenario: The site font is Amethysta
    Given I open the landing page
    Then the page text is set in "Amethysta"
    And the font "Amethysta" has loaded

  Scenario: The Panel titles are set in Overused Grotesk
    When I open "/explore"
    Then the font "Overused Grotesk" has loaded

  Scenario: The font license is served with the font
    When I fetch "/licenses/fonts-OFL.txt"
    Then the response contains "SIL OPEN FONT LICENSE Version 1.1"

Feature: Open and close a Panel

  Scenario Outline: A deep link renders that Panel opened
    When I open "<path>"
    Then I am on "<path>"
    And the page heading reads "<title>"
    And the other four Panels are Stripes
    And the document title is "<title> · A.Durnev portfolio"

    Examples:
      | path       | title        |
      | /about     | About        |
      | /what-i-do | What I do    |
      | /skills    | Skills       |
      | /chat      | Chat with me |
      | /contact   | Contact      |

  Scenario: The default Board has the site title and no heading
    When I open "/explore"
    Then there is no page heading
    And the document title is "A.Durnev portfolio"

  Scenario: Clicking a Panel title opens it
    Given I open "/explore"
    When I click the Panel "Skills"
    Then I am on "/skills"
    And the page heading reads "Skills"
    And the page heading has focus
    And the other four Panels are Stripes

  Scenario: Clicking a Stripe switches Panels
    Given I open "/skills"
    When I click the Panel "Contact"
    Then I am on "/contact"
    And the page heading reads "Contact"
    And the page heading has focus
    And the document title is "Contact · A.Durnev portfolio"

  Scenario: The close button returns to the default Board and focus to the Panel
    Given I open "/explore"
    And I click the Panel "Skills"
    When I click the close button "Close Skills"
    Then I am on "/explore"
    And there is no page heading
    And the Panel "Skills" has focus
    And the Board lists the five Panels

  Scenario: Escape returns to the default Board and focus to the Panel
    Given I open "/explore"
    And I click the Panel "Contact"
    When I press Escape
    Then I am on "/explore"
    And the Panel "Contact" has focus

  Scenario: Clicking the Expanded panel itself does nothing
    Given I open "/skills"
    When I click the page heading
    Then I am on "/skills"
    And the page heading reads "Skills"

  Scenario: The close button is a titled circle whose icon screen readers skip
    When I open "/skills"
    Then the close button "Close Skills" has its icon hidden from screen readers

  Scenario: Every change is a history entry and Back and Forward walk through them
    Given I open "/explore"
    When I click the Panel "Skills"
    And I click the Panel "Contact"
    And I click the close button "Close Contact"
    And I go back
    Then I am on "/contact"
    And the page heading reads "Contact"
    When I go back
    Then I am on "/skills"
    And the page heading reads "Skills"
    When I go forward
    Then I am on "/contact"

  Scenario: The theme colour follows the Expanded panel
    When I open "/skills"
    Then the theme colour is "#67b3a8"
    When I click the close button "Close Skills"
    Then the theme colour is "#182223"

  Scenario: Desktop Stripes are narrow, read top to bottom, and stay in view while scrolling
    Given the window is 1280 by 800
    When I open "/about"
    And the page content is 2000px tall
    Then the Stripes are narrower than 120px and run top to bottom
    When I scroll down 100px
    Then the Stripes and the close button are still in view

  Scenario: Every Board state starts at the top
    Given the window is 1280 by 400
    And I open "/about"
    When I scroll down 100px
    And I click the Panel "Skills"
    Then the page is at the top
    When I scroll down 100px
    And I click the close button "Close Skills"
    Then the page is at the top

  Scenario: Mobile Stripes are rows of at least 44px without Sublabels, and scroll away
    Given the window is 375 by 667
    When I open "/skills"
    Then the Stripes are rows at least 44px tall, with no Sublabel
    And the Expanded panel fills the rest of the window

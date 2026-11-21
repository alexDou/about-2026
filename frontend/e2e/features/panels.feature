Feature: Open and close a Panel

  Scenario Outline: A deep link renders that Panel opened
    When I open "<path>"
    Then I am on "<path>"
    And the page heading reads "<heading>"
    And the other four Panels are Stripes
    And the document title is "<title> · A.Durnev portfolio"

    Examples:
      | path       | title        | heading      |
      | /about     | About        | About        |
      | /what-i-do | What I do    | What I do    |
      | /skills    | Skills       | Skills       |
      | /chat      | Chat with me | Chat with me |
      | /contact   | Contact      | Contact me   |

  Scenario: The default Explore has the site title and no heading
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
    And the page heading reads "Contact me"
    And the page heading has focus
    And the document title is "Contact · A.Durnev portfolio"

  Scenario: The close button returns to the default Explore and focus to the Panel
    Given I open "/explore"
    And I click the Panel "Skills"
    When I click the close button "Close Skills"
    Then I am on "/explore"
    And there is no page heading
    And the Panel "Skills" has focus
    And Explore lists the five Panels

  Scenario: Escape returns to the default Explore and focus to the Panel
    Given I open "/explore"
    And I click the Panel "Contact"
    And the page heading reads "Contact me"
    When I press Escape
    Then I am on "/explore"
    And the Panel "Contact" has focus
    And Explore lists the five Panels

  Scenario: Clicking the Expanded panel itself does nothing
    Given I open "/skills"
    When I click the page heading
    Then I am on "/skills"
    And the page heading reads "Skills"

  Scenario: The close button is a titled corner, exactly in the Expanded panel's top-right corner
    When I open "/skills"
    Then the close button "Close Skills" is titled by its label
    And the close button is a target of at least 24 by 24 pixels
    And the close button sits in the Expanded panel's top-right corner

  Scenario: Every change is a history entry and Back and Forward walk through them
    Given I open "/explore"
    When I click the Panel "Skills"
    And I click the Panel "Contact"
    And I click the close button "Close Contact"
    And I go back
    Then I am on "/contact"
    And the page heading reads "Contact me"
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
    Then the Stripes are still in view
    And the close button sits in the Expanded panel's top-right corner

  Scenario: On a wide screen the About badges share one line, half over the top card
    Given the window is 1280 by 800
    When I open "/about"
    Then the close button covers none of the badges
    And the six badges share one line
    And the top card's top border runs through the badges' middle

  Scenario: Up to 1056px wide the About badges sit in rows of three above the top card
    Given the window is 1000 by 800
    When I open "/about"
    Then the close button covers none of the badges
    And the badges sit in rows of three above the top card

  Scenario: On a phone the close button stays in the Expanded panel's top-right corner
    Given the window is 375 by 667
    When I open "/about"
    And the page content is 2000px tall
    Then the close button covers none of the badges
    And the badges sit in rows of three above the top card
    When I scroll down 300px
    Then the close button sits in the Expanded panel's top-right corner

  Scenario: Every Explore state starts at the top
    Given the window is 1280 by 400
    And I open "/about"
    When I scroll down 100px
    And I click the Panel "Skills"
    Then the page is at the top
    When I scroll down 100px
    And I click the close button "Close Skills"
    Then the page is at the top

  Scenario: Switching from a scrolled page scrolls up smoothly before the Panels change
    Given the visitor accepts motion
    And the window is 1280 by 400
    And I open "/about"
    And the page content is 1500px tall
    When I scroll down 600px
    And I click the Panel "Contact"
    Then the page is still scrolled down
    And the page is at the top
    And the page heading reads "Contact me"

  Scenario: Mobile Stripes are rows of at least 44px without Sublabels, and scroll away
    Given the window is 375 by 667
    When I open "/skills"
    Then the Stripes are rows at least 44px tall, with no Sublabel
    And the Stripes are taller than their title line
    And the Expanded panel fills the rest of the window

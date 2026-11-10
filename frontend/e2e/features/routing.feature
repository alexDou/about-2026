Feature: Landing and Board routing

  Scenario: Back and Forward move between the Landing and the Board
    Given I open the landing page
    When I click the logo
    Then I am on "/explore"
    When I go back
    Then I am on "/"
    And the logo is shown
    When I go forward
    Then I am on "/explore"
    And the Board lists the five Panels

  Scenario: A direct visit to /explore shows the Board
    When I open "/explore"
    Then I am on "/explore"
    And the Board lists the five Panels

  Scenario: A Panel URL shows that Panel opened
    When I open "/skills"
    Then I am on "/skills"
    And the page heading reads "Skills"

  Scenario: An unknown path is replaced by the Landing without a history entry
    Given I open "/explore"
    When I open "/nope"
    Then I am on "/"
    And the logo is shown
    When I go back
    Then I am on "/explore"

  Scenario: A trailing slash is dropped without a history entry
    Given I open "/about"
    When I open "/explore/"
    Then I am on "/explore"
    When I go back
    Then I am on "/about"

  Scenario: A plain click on a Panel title stays in the app
    Given I open "/explore"
    When I mark the document to detect a reload
    And I click the Panel "Skills"
    Then I am on "/skills"
    And the document was not reloaded

  Scenario: Panel titles are real links
    When I open "/explore"
    Then the Panel "Chat with me" links to "/chat"

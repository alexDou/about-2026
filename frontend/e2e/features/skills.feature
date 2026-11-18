Feature: Skills

  Scenario: A Certificate opens in its view and Escape closes only the view
    When I open "/skills"
    And I open the Skill group "Programming languages"
    And I click the Certificate link "TestDome"
    Then the Certificate view "Python" is open
    And the Certificate image is shown
    When I press Escape
    Then the Certificate view "Python" is closed
    And I am on "/skills"
    And the page heading reads "Skills"

  Scenario: The Certificate view closes by its own button
    When I open "/skills"
    And I open the Skill group "Programming languages"
    And I click the Certificate link "Educative"
    Then the Certificate view "Clean Code in Python" is open
    When I close the Certificate view
    Then the Certificate view "Clean Code in Python" is closed

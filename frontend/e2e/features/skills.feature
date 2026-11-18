Feature: Skills

  Scenario: The Skills page opens with its controls and the eight Skill groups, all closed
    When I open "/skills"
    Then the page heading reads "Skills"
    And the button "Expand all" is shown
    And the button "Copy skills" is shown
    And the Skill groups, in order, are:
      | Programming languages |
      | Frontend              |
      | Backend               |
      | AI                    |
      | Databases & search    |
      | Cloud & DevOps        |
      | Testing & quality     |
      | Engineering practice  |
    And every Skill group is collapsed
    And the Skill "TypeScript" is out of sight

  Scenario: A group heading opens the group with every overview in it, and the next click closes it
    When I open "/skills"
    And I open the Skill group "Programming languages"
    Then "Programming languages" is expanded
    And the Skill "TypeScript" is shown
    And "Overview of TypeScript" is expanded
    And "Overview of Rust" is expanded
    When I close the Skill group "Programming languages"
    Then "Programming languages" is collapsed
    And the Skill "TypeScript" is out of sight

  Scenario: A Skill's arrow opens and closes its overview without touching its group
    When I open "/skills"
    And I open the Skill group "Programming languages"
    And I click the button "Overview of TypeScript"
    Then "Overview of TypeScript" is collapsed
    And "Overview of Rust" is expanded
    And "Programming languages" is expanded
    When I click the button "Overview of TypeScript"
    Then "Overview of TypeScript" is expanded

  Scenario: A subgroup heading opens all its Skills, or closes all when some were closed by hand
    When I open "/skills"
    And I open the Skill group "Databases & search"
    Then "SQL" is expanded
    When I click the button "Overview of SQLite"
    And I click the button "SQL"
    Then "Overview of PostgreSQL & MySQL" is collapsed
    And "Overview of SQLite" is collapsed
    And "SQL" is collapsed
    And "NoSQL" is expanded
    When I click the button "SQL"
    Then "Overview of PostgreSQL & MySQL" is expanded
    And "Overview of SQLite" is expanded
    And "Databases & search" is expanded

  Scenario: Closing all of a subgroup's Skills by hand closes its heading
    When I open "/skills"
    And I open the Skill group "Databases & search"
    And I click the button "Overview of PostgreSQL & MySQL"
    And I click the button "Overview of SQLite"
    Then "SQL" is collapsed
    And "Databases & search" is expanded
    When I click the button "SQL"
    Then "SQL" is expanded
    And "Overview of PostgreSQL & MySQL" is expanded
    And "Overview of SQLite" is expanded

  Scenario: Expand all opens every group and overview, and Collapse all closes them
    When I open "/skills"
    And I click the button "Expand all"
    Then the button "Collapse all" is shown
    And every Skill group is expanded
    And every overview is expanded
    And "SQL" is expanded
    And the Skills text has no placeholder
    When I click the button "Collapse all"
    Then the button "Expand all" is shown
    And every Skill group is collapsed
    And every overview is collapsed

  Scenario: Expand all keeps its position while Skills are opened and closed by hand
    When I open "/skills"
    And I click the button "Expand all"
    Then the button "Collapse all" is shown
    When I click the button "Overview of TypeScript"
    Then "Overview of TypeScript" is collapsed
    And the button "Collapse all" is shown
    When I close the Skill group "Programming languages"
    Then the button "Collapse all" is shown

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
    And "Programming languages" is expanded

  Scenario: The Certificate view closes by its own button
    When I open "/skills"
    And I open the Skill group "Programming languages"
    And I click the Certificate link "Educative"
    Then the Certificate view "Clean Code in Python" is open
    When I close the Certificate view
    Then the Certificate view "Clean Code in Python" is closed

  Scenario: Copy skills puts all the Skills on the clipboard, though every group is closed
    Given the visitor lets the page use the clipboard
    When I open "/skills"
    And I click the button "Copy skills"
    Then "Copied" is announced in the status region
    And the clipboard starts with the Skills text
    And the clipboard has the line "Engineering practice"
    And the clipboard has the line "  APIs & services"
    And the clipboard has the line "    Certified: TypeScript, TestDome, Jul 2020, Top 10%"

  Scenario: Opening every group by hand leaves Expand all off
    When I open "/skills"
    And I open every Skill group by hand
    Then every Skill group is expanded
    And the button "Expand all" is shown

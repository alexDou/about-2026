Feature: Offline note in Chat with me and Contact

  Scenario Outline: With the backend unreachable, <title> shows the offline note
    Given the backend is unreachable
    When I open "<path>"
    Then the page heading reads "<title>"
    And the offline note is shown

    Examples:
      | path     | title        |
      | /chat    | Chat with me |
      | /contact | Contact me   |

  Scenario: The note shows when the Panel opens from Explore
    Given the backend is unreachable
    And I open "/explore"
    When I click the Panel "Chat with me"
    Then the offline note is shown
    When I click the Panel "Contact"
    Then the offline note is shown

  Scenario: Other Panels have no offline note
    Given the backend is unreachable
    When I open "/about"
    Then the page heading reads "About"
    And the page has no place for an offline note

  Scenario: With the backend up there is no offline note
    Given the backend is up
    When I open "/chat"
    Then the page heading reads "Chat with me"
    And there is no offline note

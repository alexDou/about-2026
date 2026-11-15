Feature: About

  Scenario: The top card greets the Visitor with the Owner's photo
    Given the window is 1280 by 800
    When I open "/about"
    Then the top card says "Hello, I'm Alexander Durnev."
    And the top card says "Senior Full-Stack Engineer and System Design Specialist."
    And the photo "Alexander Durnev" is shown

  Scenario: The six badges each carry a title
    Given the window is 1280 by 800
    When I open "/about"
    Then the badges read and are titled:
      | AVAILABLE NOW       | Can start immediately.                                                            |
      | FULL-TIME           | Open to a permanent, full-time position.                                          |
      | CONTRACT            | Open to contract work.                                                            |
      | RELOCATION          | Open to relocation anywhere, for the right offer.                                 |
      | REMOTE WORK / READY | Remote first, with years in distributed international teams.                      |
      | AI READY            | I build AI features into products and work with agentic, AI-assisted development. |

  Scenario: On a desktop the badges share one line, clear of the close button
    Given the window is 1280 by 800
    When I open "/about"
    Then the six badges share one line
    And the close button covers none of the badges

  Scenario: The lower cards follow the top card in order
    Given the window is 1280 by 800
    When I open "/about"
    Then the cards are headed in order "Bio, Experience, Education, Languages, Hobbies"

  Scenario: The five Roles run from the newest to the oldest
    Given the window is 1280 by 800
    When I open "/about"
    Then the Roles are listed in order:
      | Senior Frontend Developer · Technical Lead |
      | Senior Frontend Developer                  |
      | Senior Web Developer                       |
      | Full-Stack Developer                       |
      | Full-Stack Web Developer                   |

  Scenario: On a phone the badges come first, then the photo, then the rest
    Given the window is 375 by 667
    When I open "/about"
    Then the badges, the photo and the Bio card follow each other down the page

  Scenario: The CV button downloads the CV
    Given the window is 1280 by 800
    When I open "/about"
    And I click the link "Download my CV"
    Then the browser downloads "alexander-durnev-cv-en.pdf"

  Scenario: The final content is in place
    Given the window is 1280 by 800
    When I open "/about"
    Then About shows no placeholder text

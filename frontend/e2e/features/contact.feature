Feature: Contact Panel layout

  Scenario: On a desktop the links and the notice stand left of the form column
    Given the window is 1280 by 800
    When I open "/contact"
    Then the page heading reads "Contact"
    And the Contact band is light with dark text
    And the Contact band says "Remote, worldwide"
    And the Contact profile links are "LinkedIn, Xing"
    And the Contact band says "I use these details only to reply to your request."
    And the Contact left column stands beside the form column

  Scenario: On a phone the remote line, the links, the form and the notice stack in that order, the notice right above the button
    Given the window is 390 by 800
    When I open "/contact"
    Then the Contact items stack down the page in the order "remote, links, form, notice, submit"

  Scenario: A Visitor sends a Contact request
    Given the backend is up
    And the backend accepts Contact requests
    When I open "/contact"
    And I fill in "Name" with "Ada Lovelace"
    And I fill in "Company" with "Analytical Engines"
    And I press "Send"
    Then the Contact form says "Thank you, Ada Lovelace. I'll get back to you soon."
    And the form is gone
    And the backend received a Contact request from "Ada Lovelace" at "Analytical Engines"

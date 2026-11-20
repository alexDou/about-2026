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

  Scenario: Pressing Send on an empty form names what is missing and focuses the first field
    Given the backend is up
    And the backend accepts Contact requests
    When I open "/contact"
    And I press "Send"
    Then the page says "Please enter your name."
    And the page says "Please enter your company."
    And the field "Name" is in error
    And the field "Name" has focus
    And the backend received no Contact request

  Scenario: A field is checked when it is left, not while it is typed in
    Given the backend is up
    When I open "/contact"
    And I fill in "Company" with "   "
    Then the page does not say "Please enter your company."
    When I leave the field "Company"
    Then the page says "Please enter your company."

  Scenario: A counter appears past 80% of a field's limit, and a value over the limit is refused
    Given the backend is up
    When I open "/contact"
    And I fill in "Name" with "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    Then the page says "73 / 80"
    When I fill in "Name" with "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    And I leave the field "Name"
    Then the page says "At most 80 characters."

  Scenario: The backend refusing the fields shows a generic notice and keeps what was typed
    Given the backend is up
    And the backend refuses Contact requests with 422
    When I open "/contact"
    And I fill in "Name" with "Ada Lovelace"
    And I fill in "Company" with "Analytical Engines"
    And I press "Send"
    Then the page says "Some details were not accepted. Please check the form and try again."
    And the field "Name" holds "Ada Lovelace"

  Scenario: When the email is not sent the form comes back with a countdown before Send works again
    Given the backend is up
    And the backend refuses Contact requests with 502
    When I open "/contact"
    And I fill in "Name" with "Ada Lovelace"
    And I fill in "Company" with "Analytical Engines"
    And I press "Send"
    Then the failure notice counts down from 10 s
    And the Send button is disabled
    And the field "Name" holds "Ada Lovelace"
    And the field "Company" holds "Analytical Engines"

  Scenario: A network failure is handled in the same way
    Given the backend is up
    And Contact requests cannot reach the backend
    When I open "/contact"
    And I fill in "Name" with "Ada Lovelace"
    And I fill in "Company" with "Analytical Engines"
    And I press "Send"
    Then the failure notice counts down from 10 s
    And the Send button is disabled
    And the field "Company" holds "Analytical Engines"

  Scenario: With the backend down the form is disabled while the links and the notice stay
    Given the backend is unreachable
    When I open "/contact"
    Then the offline note is shown
    And the Contact form is disabled
    And the Contact profile links are "LinkedIn, Xing"
    And the Contact band says "I use these details only to reply to your request."

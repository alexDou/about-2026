Feature: Contact Panel layout

  Scenario: On a desktop the form stands left of the info block, which is centred against the inputs
    Given the window is 1280 by 800
    When I open "/contact"
    Then the page heading reads "Contact me"
    And the page heading is in capitals
    And the page says "Let me know you're interested"
    And the Contact page has no band and its text is in the About colour
    And the Contact band says "Remote, worldwide"
    And the Contact profile links are "LinkedIn, Xing"
    And the Contact band says "I use these details only to reply to your request."
    And the Contact band says "* required"
    And the Contact form stands left of the other items
    And the Contact info block is centred against the form's inputs
    And the Contact items stack down the page in the order "remote, notice, links, required"
    And the Contact info shows 3 rules

  Scenario: On a medium screen the info block stands under the form
    Given the window is 1000 by 800
    When I open "/contact"
    Then the Contact info block stands under the form
    And the Contact items stack down the page in the order "remote, notice, links, required"
    And the Contact info shows 3 rules

  Scenario: On a phone the remote line, the form with its button, the notice, the required line and the links stack in that order
    Given the window is 390 by 800
    When I open "/contact"
    Then the Contact items stack down the page in the order "remote, form, submit, notice, required, links"
    And the Contact info shows 0 rules

  Scenario: On a desktop a label stands beside its input
    Given the window is 1280 by 800
    When I open "/contact"
    Then every Contact label stands beside its input

  Scenario: Under 568px a label stands above its input
    Given the window is 560 by 800
    When I open "/contact"
    Then every Contact label stands above its input

  Scenario: The Send button stands under the last input and is as wide as the inputs
    Given the window is 1280 by 800
    When I open "/contact"
    Then the Send button stands under the inputs, as wide as they are

  Scenario: A Visitor sends a Contact request
    Given the backend is up
    And the backend accepts Contact requests
    When I open "/contact"
    And I fill in "Your name" with "Ada Lovelace"
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
    And the field "Your name" is in error
    And the field "Your name" has focus
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
    And I fill in "Your name" with "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    Then the page says "73 / 80"
    When I fill in "Your name" with "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    And I leave the field "Your name"
    Then the page says "At most 80 characters."

  Scenario: The backend refusing the fields shows a generic notice and keeps what was typed
    Given the backend is up
    And the backend refuses Contact requests with 422
    When I open "/contact"
    And I fill in "Your name" with "Ada Lovelace"
    And I fill in "Company" with "Analytical Engines"
    And I press "Send"
    Then the page says "Some details were not accepted. Please check the form and try again."
    And the field "Your name" holds "Ada Lovelace"

  Scenario: When the email is not sent the form comes back with a countdown before Send works again
    Given the backend is up
    And the backend refuses Contact requests with 502
    When I open "/contact"
    And I fill in "Your name" with "Ada Lovelace"
    And I fill in "Company" with "Analytical Engines"
    And I press "Send"
    Then the failure notice counts down from 10 s
    And the Send button is disabled
    And the field "Your name" holds "Ada Lovelace"
    And the field "Company" holds "Analytical Engines"

  Scenario: A network failure is handled in the same way
    Given the backend is up
    And Contact requests cannot reach the backend
    When I open "/contact"
    And I fill in "Your name" with "Ada Lovelace"
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

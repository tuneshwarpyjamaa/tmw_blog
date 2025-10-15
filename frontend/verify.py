from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Increase the timeout for the whole test
    page.set_default_timeout(60000)

    # Navigate to the registration page
    page.goto('http://localhost:3000/register')

    # Fill in the registration form
    page.get_by_label('Email Address').fill('test@example.com')
    page.get_by_label('Password').fill('password123')

    # Set up a listener for the alert dialog
    alert_message = None
    def handle_dialog(dialog):
        nonlocal alert_message
        alert_message = dialog.message
        dialog.accept()

    page.on('dialog', handle_dialog)

    # Click the "Sign Up" button
    page.get_by_role('button', name='Sign Up').click()

    # Wait for the navigation to the login page
    page.wait_for_url('http://localhost:3000/login')

    # Assert the alert message
    assert alert_message == 'Sign up successful! Please sign in.'

    # Take a screenshot of the login page
    page.screenshot(path='frontend/verification.png')

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

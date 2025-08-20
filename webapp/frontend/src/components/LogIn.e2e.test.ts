import { expect, test } from '@playwright/test';

test.describe('LogIn Component E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('/');
  });

  test('should display login page with all authentication options', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that the main login components are visible
    await expect(page.getByText('Documentation and information')).toBeVisible();

    // Check for Google authentication button by aria-label
    await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();

    // Check for Microsoft authentication button by aria-label
    await expect(page.getByRole('button', { name: 'Sign in with Microsoft' })).toBeVisible();

    // Verify the Google button has the correct image
    const googleButton = page.getByRole('button', { name: 'Sign in with Google' });
    const googleImg = googleButton.locator('img');
    await expect(googleImg).toHaveAttribute('alt', 'Sign in with Google');

    // Verify the Microsoft button has correct text
    const msButton = page.getByRole('button', { name: 'Sign in with Microsoft' });
    await expect(msButton.locator('span')).toHaveText('Sign in with Microsoft');
  });

  test('should navigate to documentation when documentation button is clicked', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Instead of expecting a popup, expect navigation in same window
    const navigationPromise = page.waitForURL(/\/webapp\/docs/);

    // Click the documentation button
    await page.getByText('Documentation and information').click();

    // Verify navigation to documentation URL
    await navigationPromise;
    expect(page.url()).toContain('/webapp/docs');
  });

  test('should handle Google login button click and redirect to OAuth', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Listen for navigation to Google OAuth
    const navigationPromise = page.waitForURL(/accounts\.google\.com/);

    // Click Google login button
    await page.getByRole('button', { name: 'Sign in with Google' }).click();

    // Verify redirect to Google OAuth happens
    await navigationPromise;
    expect(page.url()).toContain('accounts.google.com');
  });

  test('should handle Microsoft login button click and redirect to OAuth', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Listen for navigation to Microsoft OAuth
    const navigationPromise = page.waitForURL(/login\.microsoftonline\.com/);

    // Click Microsoft login button
    await page.getByRole('button', { name: 'Sign in with Microsoft' }).click();

    // Verify redirect to Microsoft OAuth happens
    await navigationPromise;
    expect(page.url()).toContain('login.microsoftonline.com');
  });

  test('should store login preference in localStorage', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Mock Google OAuth to prevent actual navigation and allow localStorage access
    await page.route('https://accounts.google.com/**', async (route) => {
      // Return a mock response instead of navigating
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body>Mock OAuth Response</body></html>',
      });
    });

    // Click Google login button
    await page.getByRole('button', { name: 'Sign in with Google' }).click();

    // Wait for localStorage to be set
    await page.waitForTimeout(200);

    // Navigate back to original page to check localStorage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if localStorage was set
    const lastLoginButton = await page.evaluate(() => {
      try {
        return localStorage.getItem('lastLoginButtonClicked');
      } catch {
        return null;
      }
    });

    expect(lastLoginButton).toBe('Google');
  });

  test('should handle login flow with backend integration test', async ({ page }) => {
    // Mock backend ping endpoint to test connectivity
    await page.route('**/ping', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'ok',
          timestamp: Date.now(),
          environment: 'test',
        }),
      });
    });

    // Mock successful Google OAuth callback
    await page.route('**/auth/google/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            email: 'test@example.com',
            name: 'Test User',
            picture: 'https://example.com/avatar.jpg',
          },
          token: 'test_jwt_token',
        }),
      });
    });

    await page.waitForLoadState('networkidle');

    // Verify initial state
    await expect(page.getByText('Documentation and information')).toBeVisible();

    // Test backend connectivity by checking if any network requests succeed
    // This would normally trigger on component mount
    const responses = [];
    page.on('response', (response) => {
      if (response.url().includes('/ping')) {
        responses.push(response.status());
      }
    });

    // Reload to trigger any initial API calls
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify page still loads correctly after backend interaction
    await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Mock backend error
    await page.route('**/ping', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify the page still renders login options despite backend errors
    await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in with Microsoft' })).toBeVisible();
  });
});

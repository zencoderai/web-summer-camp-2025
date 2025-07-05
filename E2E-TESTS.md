# E2E Tests for Web Summer Camp 2025

This directory contains end-to-end tests for the Web Summer Camp 2025 conference application using Playwright.

## Test Coverage

The test suite covers the following scenarios:

### Talk Submission Flow
- **Complete talk submission workflow**: Tests the entire process from navigating to the homepage, clicking the submit button, filling out the form, and verifying the talk appears in the talks list
- **Navigation between pages**: Tests that navigation links work correctly between Home, Submit Talk, and View Talks pages
- **Form validation**: Tests that required fields are enforced
- **Track filtering**: Tests that the track filter buttons work on the talks list page

## Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Docker** (for running the application stack)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running the Tests

### Run all tests
```bash
npm test
```

### Run with UI mode (interactive)
```bash
npm run test:ui
```

### Run in debug mode
```bash
npm run test:debug
```

### Run specific test file
```bash
npx playwright test tests/talk-submission.spec.ts
```

### Generate test report
```bash
npm run test:report
```

## Test Structure

```
tests/
├── talk-submission.spec.ts    # Main talk submission flow tests
```

## Configuration

The tests are configured in `playwright.config.ts` with:
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium (Firefox and WebKit commented out for faster runs)
- **Automatic server startup**: Frontend server starts automatically
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Traces**: Collected on retry

## Writing New Tests

1. Create a new `.spec.ts` file in the `tests/` directory
2. Import the test framework:
```typescript
import { test, expect } from '@playwright/test';
```

3. Follow the existing patterns for page navigation and assertions
4. Use data-testid attributes when possible for stable selectors
5. Make tests deterministic by using unique identifiers

## Test Data

Tests use unique timestamps to avoid conflicts when running in parallel:
```typescript
const timestamp = Date.now();
const uniqueTalkTitle = `My Talk Title - ${timestamp}`;
```

## CI/CD Integration

The tests are configured to run in CI environments with:
- Retries on failure
- Parallel execution disabled for stability
- HTML reporting
- Automatic browser installation

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure the frontend is running on port 3000
2. **Database state**: Tests create real data in the database
3. **Timing issues**: Use Playwright's built-in waits instead of hardcoded delays

### Debug Mode

Run tests in debug mode to step through them:
```bash
npx playwright test --debug
```

### Screenshots and Videos

Failed tests automatically capture:
- Screenshots in `test-results/`
- Videos in `test-results/`
- Traces for debugging

## Best Practices

1. **Use semantic selectors**: Prefer role-based selectors over CSS classes
2. **Avoid hard waits**: Use Playwright's built-in waiting mechanisms
3. **Test real user flows**: Focus on complete workflows rather than isolated features
4. **Keep tests independent**: Each test should be able to run in isolation
5. **Use descriptive test names**: Make it clear what each test is verifying

## Example Test Structure

```typescript
test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    // Arrange
    await page.goto('/');
    
    // Act
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Assert
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```
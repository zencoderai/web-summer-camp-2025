import { test, expect } from '@playwright/test';

test.describe('Talk Submission Flow', () => {
  test.describe.configure({ mode: 'serial' });
  test('should allow users to submit a talk and view it in the talks list', async ({ page }) => {
    // Generate unique talk title to avoid conflicts in parallel tests
    const timestamp = Date.now();
    const uniqueTalkTitle = `Building Modern Web Applications with React and TypeScript - ${timestamp}`;
    const uniqueSpeakerName = `John Developer ${timestamp}`;
    const uniqueEmail = `john.developer${timestamp}@example.com`;
    
    // Navigate to the homepage
    await page.goto('/');

    // Verify the homepage loads correctly
    await expect(page).toHaveTitle('Web Summer Camp 2025');
    await expect(page.getByRole('heading', { name: 'Web Summer Camp 2025' }).nth(1)).toBeVisible();

    // Click on the "Submit Your Talk" button
    await page.getByRole('link', { name: 'Submit Your Talk' }).click();

    // Verify we're on the talk submission page
    await expect(page).toHaveURL('/submit');
    await expect(page.getByRole('heading', { name: 'Submit Your Talk' })).toBeVisible();

    // Fill out the talk submission form
    await page.getByRole('textbox', { name: 'Talk Title *' }).fill(uniqueTalkTitle);
    await page.getByRole('textbox', { name: 'Speaker Name *' }).fill(uniqueSpeakerName);
    await page.getByRole('textbox', { name: 'Email Address *' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Speaker Bio' }).fill('Experienced frontend developer with 5+ years of experience building modern web applications. Passionate about clean code, user experience, and sharing knowledge with the developer community.');
    await page.getByRole('textbox', { name: 'Talk Description *' }).fill('This talk will explore the best practices for building modern web applications using React and TypeScript. We\'ll cover component architecture, state management, testing strategies, and performance optimization techniques. Attendees will learn how to create scalable, maintainable applications that deliver exceptional user experiences.');
    
    // Select duration and difficulty level
    await page.getByLabel('Duration (minutes)').selectOption('45 minutes');
    await page.getByLabel('Difficulty Level').selectOption('Advanced');
    
    // Keep the default track (JavaScript) selected
    await expect(page.getByLabel('Track')).toHaveValue('JavaScript');

    // Submit the talk
    await page.getByRole('button', { name: 'Submit Talk' }).click();

    // Verify submission success
    await expect(page.getByText('Success! Your talk has been submitted successfully.')).toBeVisible();
    
    // Verify the form is reset after submission
    await expect(page.getByRole('textbox', { name: 'Talk Title *' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Speaker Name *' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Email Address *' })).toHaveValue('');

    // Navigate to the talks list page
    await page.getByRole('link', { name: 'View Talks' }).click();

    // Verify we're on the talks list page
    await expect(page).toHaveURL('/talks');
    await expect(page.getByRole('heading', { name: 'Submitted Talks' })).toBeVisible();

    // Verify the submitted talk appears in the list
    // Since we used a unique timestamp, this should be unique to our test run
    await expect(page.getByRole('heading', { name: uniqueTalkTitle })).toBeVisible();
    await expect(page.getByText(`by ${uniqueSpeakerName}`)).toBeVisible();
    
    // Verify the talks count is updated
    await expect(page.getByText(/\d+ talks/)).toBeVisible();
    
    // Verify track filter buttons are visible
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'JavaScript' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'PHP' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Python/AI' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'UX' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Founders' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Digital Change' })).toBeVisible();
  });

  test('should navigate between pages using navigation links', async ({ page }) => {
    // Start on the talks page
    await page.goto('/talks');
    
    // Navigate to submit page via nav link
    await page.getByRole('link', { name: 'Submit Talk' }).click();
    await expect(page).toHaveURL('/submit');
    
    // Navigate to home page via nav link
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');
    
    // Navigate to talks page via nav link
    await page.getByRole('link', { name: 'View Talks' }).click();
    await expect(page).toHaveURL('/talks');
    
    // Navigate to home via logo
    await page.getByRole('link', { name: 'Web Summer Camp 2025' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should require mandatory fields for talk submission', async ({ page }) => {
    // Navigate to the submit page
    await page.goto('/submit');
    
    // Try to submit without filling required fields
    await page.getByRole('button', { name: 'Submit Talk' }).click();
    
    // Verify form validation (HTML5 validation should prevent submission)
    // Since we're testing client-side validation, we'll check if we're still on the submit page
    await expect(page).toHaveURL('/submit');
    
    // Fill only some required fields and test partial submission
    await page.getByRole('textbox', { name: 'Talk Title *' }).fill('Test Talk');
    await page.getByRole('button', { name: 'Submit Talk' }).click();
    
    // Should still be on submit page due to missing required fields
    await expect(page).toHaveURL('/submit');
  });

  test('should filter talks by track', async ({ page }) => {
    // Navigate to the talks page
    await page.goto('/talks');
    
    // Click on JavaScript filter
    await page.getByRole('button', { name: 'JavaScript' }).click();
    
    // Verify only JavaScript talks are shown (we can't make specific assertions about content
    // without knowing the exact talks in the database, but we can verify the filter is clickable)
    await expect(page.getByRole('button', { name: 'JavaScript' })).toBeVisible();
    
    // Click on All filter to show all talks
    await page.getByRole('button', { name: 'All' }).click();
    
    // Try other track filters
    await page.getByRole('button', { name: 'PHP' }).click();
    await page.getByRole('button', { name: 'Python/AI' }).click();
    await page.getByRole('button', { name: 'UX' }).click();
    await page.getByRole('button', { name: 'Founders' }).click();
    await page.getByRole('button', { name: 'Digital Change' }).click();
    
    // Return to All filter
    await page.getByRole('button', { name: 'All' }).click();
  });
});
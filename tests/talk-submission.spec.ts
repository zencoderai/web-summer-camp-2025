import { test, expect } from '@playwright/test';

test.describe('Talk Submission Flow', () => {
  test('should submit a talk and verify it appears on the submitted talks page', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Verify we're on the correct page
    await expect(page).toHaveTitle('Web Summer Camp 2025');
    
    // Click on the "Submit Talk" navigation link
    await page.getByRole('link', { name: 'Submit Talk' }).click();
    
    // Verify we're on the submission page
    await expect(page).toHaveURL('/submit');
    await expect(page.getByRole('heading', { name: 'Submit Your Talk' })).toBeVisible();
    
    // Fill out the form with test data
    await page.getByRole('textbox', { name: 'Talk Title *' }).fill('Building Modern Web Applications with React and TypeScript');
    await page.getByRole('textbox', { name: 'Your Name *' }).fill('John Doe');
    await page.getByRole('textbox', { name: 'Email Address *' }).fill('john.doe@example.com');
    await page.getByRole('textbox', { name: 'Speaker Bio' }).fill('Senior Full-Stack Developer with 8+ years of experience building scalable web applications. Passionate about modern JavaScript frameworks and type-safe development.');
    await page.getByRole('textbox', { name: 'Talk Description *' }).fill('Learn how to build robust, scalable web applications using React and TypeScript. This talk covers best practices for component architecture, state management, and type safety. We\'ll explore advanced patterns, performance optimization techniques, and real-world examples from production applications.');
    
    // Select conference track (JavaScript Track is already selected by default)
    await expect(page.getByRole('combobox', { name: 'Conference Track *' })).toHaveValue('JavaScript');
    
    // Select duration (30 minutes is already selected by default)
    await expect(page.getByRole('combobox', { name: 'Duration (minutes)' })).toHaveValue('30');
    
    // Select difficulty level (Intermediate is already selected by default)
    await expect(page.getByRole('combobox', { name: 'Difficulty Level' })).toHaveValue('Intermediate');
    
    // Submit the form
    await page.getByRole('button', { name: 'Submit Talk Proposal' }).click();
    
    // Verify submission success message appears
    await expect(page.getByText('Your talk has been submitted successfully! We\'ll review it and get back to you soon.')).toBeVisible();
    
    // Navigate to the submitted talks page
    await page.getByRole('link', { name: 'View Talks' }).click();
    
    // Verify we're on the talks page
    await expect(page).toHaveURL('/talks');
    await expect(page.getByRole('heading', { name: 'Submitted Talks' })).toBeVisible();
    
    // Verify the submitted talk appears on the page
    await expect(page.getByRole('heading', { name: 'Building Modern Web Applications with React and TypeScript' }).first()).toBeVisible();
    
    // Verify speaker information
    await expect(page.getByText('John Doe').first()).toBeVisible();
    await expect(page.getByText('john.doe@example.com').first()).toBeVisible();
    
    // Verify track, level, and duration badges
    await expect(page.getByText('JavaScript').first()).toBeVisible();
    await expect(page.getByText('Intermediate').first()).toBeVisible();
    await expect(page.getByText('30 min').first()).toBeVisible();
    
    // Verify talk description is displayed
    await expect(page.getByText('Learn how to build robust, scalable web applications using React and TypeScript. This talk covers best practices for component architecture, state management, and type safety. We\'ll explore advanced patterns, performance optimization techniques, and real-world examples from production applications.').first()).toBeVisible();
    
    // Verify speaker bio is displayed
    await expect(page.getByText('Senior Full-Stack Developer with 8+ years of experience building scalable web applications. Passionate about modern JavaScript frameworks and type-safe development.').first()).toBeVisible();
    
    // Verify talk count is displayed (content may vary due to previous test runs)
    await expect(page.getByText(/Total: \d+ talks? submitted/)).toBeVisible();
  });
});
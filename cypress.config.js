const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: process.env.BASE_URL || 'https://example.cypress.io',
        specPattern: 'cypress/e2e/**/*.cy.js',
        supportFile: false,
        video: false,
        screenshotOnRunFailure: true,
        defaultCommandTimeout: 8000,
        retries: { runMode: 1, openMode: 0 },
    },
});
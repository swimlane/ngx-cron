import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // Keep one browser session across tests (matches root `before()` + single cy.visit in cron.cy.ts).
    // Default true (Cypress 12+) navigates to about:blank between tests and clears storage, which
    // triggers the DevTools message and breaks suites that rely on one loaded page.
    testIsolation: false,
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:4200',
  },
})

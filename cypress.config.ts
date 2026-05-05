import { defineConfig } from 'cypress'

import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require("cypress-grep/src/plugin")(config);
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    baseUrl: 'https://jsonplaceholder.typicode.com', // Example API for testing
    supportFile: 'cypress/support/e2e.ts',
    env: {
      reqres_host: 'https://reqres.in',
      dotesthere_host: 'https://dotesthere.com'
    }
  },
})
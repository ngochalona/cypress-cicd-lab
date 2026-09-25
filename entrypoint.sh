#!/bin/sh
echo "===== Cypress E2E container ====="
echo "Release     : ${RELEASE_VERSION:-local}"              
echo "Spec pattern: ${SPEC_PATTERN:-cypress/e2e/**/*.cy.js}"
echo "Built by    : ${CI_BUILD_URL:-unknown}"               

exec node /e2e/scripts/run-e2e.js
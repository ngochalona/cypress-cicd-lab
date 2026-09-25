FROM cypress/base:24.21.0

WORKDIR /e2e
ENV CI=1

COPY package.json package-lock.json ./
RUN npm ci && npx cypress verify

COPY cypress.config.notfound.js ./
COPY cypress ./cypress
COPY scripts ./scripts

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ARG CI_BUILD_URL=""
ENV CI_BUILD_URL=${CI_BUILD_URL}

ENTRYPOINT ["/entrypoint.sh"]
const cypress = require('cypress');
const SPEC_PATTERN = process.env.SPEC_PATTERN || 'cypress/e2e/**/*.cy.js';
const BROWSER = process.env.BROWSER || 'electron';
const WEBHOOK = process.env.SLACK_WEBHOOK_E2E || '';
const RELEASE = process.env.RELEASE_VERSION || 'local';
const RUN_URL = process.env.RUN_URL || '';

const STRICT = process.env.FAIL_ON_TEST_FAILURE !== 'false';

const ICON = { passed: ':white_check_mark:', failed: ':x:', pending: ':double_vertical_bar:', skipped: ':fast_forward:' };

async function notifySlack(text) {
    if (!WEBHOOK) {
        console.log('[slack] Không có SLACK_WEBHOOK_E2E -> bỏ qua gửi Slack');
        return;
    }
    try {
        const res = await fetch(WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        console.log(`[slack] HTTP ${res.status}`);
    } catch (err) {
        console.error('[slack] Gửi thất bại:', err.message);
    }
}

(async() => {
    console.log(`Chạy spec: ${SPEC_PATTERN} | browser: ${BROWSER}`);
    let result;
    try {
        result = await cypress.run({ spec: SPEC_PATTERN, browser: BROWSER });
    } catch (err) {
        result = { status: 'failed', message: err.message }; // vd: thiếu binary Cypress
    }


    if (result.status === 'failed') {
        console.error('Cypress không chạy được:', result.message);
        await notifySlack(`:rotating_light: *E2E không chạy được* (release ${RELEASE})\n${result.message}`);
        process.exit(2);
    }

    const lines = [];
    for (const run of result.runs) {
        for (const test of run.tests) {
            lines.push(`${ICON[test.state] || '•'} ${test.title.join(' › ')}`);
        }
    }

    const failed = result.totalFailed;
    const minutes = (result.totalDuration / 60000).toFixed(1);
    const header = failed > 0 ? ':red_circle: *E2E FAILED*' : ':large_green_circle: *E2E PASSED*';
    const text = [
        `${header} - release \`${RELEASE}\``,
        `Passed: ${result.totalPassed} | Failed: ${failed} | Skipped: ${result.totalPending + result.totalSkipped} | Thời gian: ${minutes} phút`,
        '',
        ...lines,
        RUN_URL ? `\n<${RUN_URL}|Xem log chi tiết>` : '',
    ].join('\n');

    console.log('\n' + text);
    await notifySlack(text);

    const code = STRICT && failed > 0 ? 1 : 0;
    console.log(`Kết thúc với exit code ${code}`);
    process.exit(code);
})();
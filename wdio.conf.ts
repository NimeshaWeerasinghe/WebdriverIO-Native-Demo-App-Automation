import path from 'node:path';
import { capabilitiesForPlatform } from './config/capabilities';
import { env } from './config/env';
import { attachFailureDetails, logSessionInfo } from './utils/reporting';

// Use the Appium server and drivers installed in this project's node_modules,
// so the run does not depend on a global Appium installation.
process.env.APPIUM_HOME = path.resolve('.');

const LOG_DIR = './reports/logs';

/**
 * One configuration for both platforms. PLATFORM (android | ios) picks the capabilities;
 * the tests and page objects are the same for both.
 */
export const config: WebdriverIO.Config = {
    runner: 'local',
    tsConfigPath: './tsconfig.json',

    // Connect to an external Appium server when APPIUM_SERVER_URL is set.
    ...(env.appiumServer ?? {}),

    // The inner array runs all spec files in ONE worker, i.e. one Appium session:
    // the app is launched once, stays open for the whole run, and the files run in this order.
    specs: [
        [
            './tests/smoke/*.spec.ts',
            './tests/signup/*.spec.ts',
            './tests/login/*.spec.ts',
            './tests/forms/*.spec.ts',
        ],
    ],
    suites: {
        smoke: ['./tests/smoke/*.spec.ts'],
        signup: ['./tests/signup/*.spec.ts'],
        login: ['./tests/login/*.spec.ts'],
        forms: ['./tests/forms/*.spec.ts'],
    },

    // One device, one session, tests run one after another.
    maxInstances: 1,
    capabilities: [capabilitiesForPlatform()],

    logLevel: 'warn',
    outputDir: LOG_DIR,
    bail: 0,

    // Default time that explicit waits (waitForDisplayed, waitUntil, expect matchers) keep polling.
    waitforTimeout: env.waitTimeout,
    // Creating the first iOS session builds WebDriverAgent, which can take over 10 minutes on CI.
    connectionRetryTimeout: env.platform === 'ios' ? 1200000 : 180000,
    connectionRetryCount: 1,

    // Starts a local Appium server for the run, unless an external one is configured.
    services: env.appiumServer ? [] : [['appium', { logPath: LOG_DIR }]],

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000,
    },

    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: './reports/allure-results',
                disableWebdriverStepsReporting: true,
                // Failure screenshots are attached once, by utils/reporting.ts.
                disableWebdriverScreenshotsReporting: true,
                reportedEnvironmentVars: { PLATFORM: env.platform },
            },
        ],
    ],

    before: async () => {
        await logSessionInfo();
    },

    afterTest: async (test, _context, { passed, error }) => {
        if (!passed) {
            await attachFailureDetails(`${test.parent} - ${test.title}`, error);
        }
    },

    // A failing beforeEach (e.g. navigation) is not a test, so attach its details here.
    afterHook: async (test, _context, { passed, error }) => {
        if (!passed) {
            await attachFailureDetails(`${test.parent} - ${test.title}`, error);
        }
    },
};

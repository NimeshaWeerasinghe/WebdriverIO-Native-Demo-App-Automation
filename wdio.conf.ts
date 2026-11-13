import path from 'node:path';

// Use the Appium server and UiAutomator2 driver installed in this project's node_modules,
// so nothing has to be installed globally.
process.env.APPIUM_HOME = path.resolve('.');

/**
 * WebdriverIO config for running the tests on one Android device or emulator.
 *
 * Optional environment variables:
 *   ANDROID_UDID     run on a specific device (see `adb devices`); defaults to the only one connected
 *   ANDROID_VERSION  platform version, e.g. "15"; not needed when only one device is connected
 */
export const config: WebdriverIO.Config = {
    runner: 'local',
    specs: ['./test/specs/**/*.spec.ts'],

    // One device means one session at a time.
    maxInstances: 1,

    capabilities: [
        {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:deviceName': 'Android',
            'appium:udid': process.env.ANDROID_UDID,
            'appium:platformVersion': process.env.ANDROID_VERSION,
            'appium:app': path.resolve('./apps/android.wdio.native.app.v2.2.0.apk'),
            'appium:appPackage': 'com.wdiodemoapp',
            'appium:appActivity': '.MainActivity',
            'appium:autoGrantPermissions': true,
            'appium:newCommandTimeout': 240,
        },
    ],

    logLevel: 'warn',
    outputDir: './logs',
    bail: 0,

    // Default time that explicit waits (waitForDisplayed, waitUntil, ...) keep polling.
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 2,

    // Starts an Appium server for the run and stops it afterwards.
    services: [['appium', { logPath: './logs' }]],

    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000,
    },

    // Save a screenshot of every failing test to help debugging.
    afterTest: async function (test, _context, { passed }) {
        if (!passed) {
            const name = `${test.parent} - ${test.title}`.replace(/[^a-z0-9-]+/gi, '_');
            await browser.saveScreenshot(`./logs/${name}.png`);
        }
    },
};

import allure from '@wdio/allure-reporter';
import { deviceInfo } from './platform';

/** Prints the device and session details once per session, so every log shows where the tests ran. */
export async function logSessionInfo() {
    console.log('Appium session started:', JSON.stringify(deviceInfo(), null, 2));
}

/**
 * Attaches what is needed to debug a failed test to the Allure report:
 * a screenshot, the session details, the error and the screen's UI hierarchy.
 */
export async function attachFailureDetails(testName: string, error?: Error) {
    try {
        const screenshot = await driver.takeScreenshot();
        allure.addAttachment(`Screenshot - ${testName}`, Buffer.from(screenshot, 'base64'), 'image/png');
        allure.addAttachment('Session info', JSON.stringify(deviceInfo(), null, 2), 'application/json');
        if (error) {
            allure.addAttachment('Error', `${error.message}\n\n${error.stack ?? ''}`, 'text/plain');
        }
        allure.addAttachment('UI hierarchy', await driver.getPageSource(), 'application/xml');
    } catch (attachError) {
        // Never hide the real test failure because the session could not give debug details.
        console.warn(`Could not attach failure details for "${testName}":`, attachError);
    }
}

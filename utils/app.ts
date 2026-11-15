import { env } from '../config/env';
import NativeAlert from '../pageobjects/NativeAlert';
import TabBar from '../pageobjects/TabBar';

// Appium's app states: 4 means "running in the foreground".
export const RUNNING_IN_FOREGROUND = 4;

/** The installed app's id: the Android package or the iOS bundle id. */
export function appId(): string {
    return driver.isIOS ? env.ios!.bundleId : env.android!.appPackage;
}

/**
 * Controlled recovery: if the app is no longer in the foreground (it crashed or was sent to
 * the background), bring it back. This never restarts or resets the app, and it is logged,
 * so an interruption is visible in the run output.
 */
export async function ensureAppInForeground() {
    const state = await driver.queryAppState(appId());
    if (state === RUNNING_IN_FOREGROUND) return;
    console.warn(`The app was not in the foreground (Appium app state ${state}); bringing it back.`);
    await driver.activateApp(appId());
    await TabBar.waitForTabBarShown();
}

/**
 * The app stays open for the whole run, so a previous test may have left the keyboard,
 * an alert or a system prompt open (for example if it failed half-way). This closes them,
 * so the next test can navigate from a clean screen without restarting the app.
 */
export async function closeOverlays() {
    await closeAndroidSavePasswordPrompt();
    await closeIosPasswordSuggestion({ waitForIt: false });
    await hideKeyboard();
    await NativeAlert.closeIfOpen();
}

/**
 * Hides the on-screen keyboard if it is open, so it cannot cover buttons or the tab bar.
 * iOS has no "hide keyboard" key: it uses the "Done" button above the keyboard when there is one,
 * otherwise a tap on `iosTapTarget` (plain text such as the screen title), otherwise the keyboard's own keys.
 */
export async function hideKeyboard(iosTapTarget?: ChainablePromiseElement) {
    if (!(await driver.isKeyboardShown())) return;
    if (driver.isIOS) {
        const doneButton = $('-ios predicate string:type == "XCUIElementTypeButton" AND name == "Done"');
        if (await doneButton.isDisplayed()) {
            await doneButton.click();
        } else if (iosTapTarget && (await iosTapTarget.isDisplayed())) {
            // Tapping non-input content closes the keyboard in React Native scroll views.
            await iosTapTarget.click();
        } else {
            await driver.execute('mobile: hideKeyboard', { keys: ['return', 'Return', 'done', 'Done'] });
        }
    } else {
        await driver.hideKeyboard();
    }
    await driver.waitUntil(async () => !(await driver.isKeyboardShown()), {
        timeoutMsg: 'The on-screen keyboard did not close.',
    });
}

/**
 * Waits up to `timeout` ms for an element that may or may not appear (e.g. a system prompt).
 * Returns false if it did not appear; any other error is passed on.
 */
async function waitForOptionalElement(element: ChainablePromiseElement, timeout: number): Promise<boolean> {
    const notShown = 'optional element not shown';
    try {
        await driver.waitUntil(() => element.isDisplayed(), { timeout, timeoutMsg: notShown });
        return true;
    } catch (error) {
        if ((error as Error).message.includes(notShown)) return false;
        throw error;
    }
}

/**
 * iOS shows a "Use Strong Password?" sheet when a password field gets focus. It covers the form
 * and swallows typed text, so close it when it appears. Does nothing on Android.
 * With waitForIt, it gives the sheet up to 3 seconds to slide in (right after focusing a field).
 */
export async function closeIosPasswordSuggestion({ waitForIt = true } = {}) {
    if (!driver.isIOS) return;
    const closeButton = $('~xmark');
    const shown = waitForIt ? await waitForOptionalElement(closeButton, 3000) : await closeButton.isDisplayed();
    if (shown) {
        await closeButton.click();
        await closeButton.waitForDisplayed({ reverse: true, timeoutMsg: 'The iOS password suggestion did not close.' });
    }
}

/**
 * After a login, Android's autofill service (e.g. Samsung Pass or Google) may ask
 * "Save sign-in info?" when the app leaves the form. Answer "Cancel" if it is showing.
 * Returns true when a prompt was closed. Does nothing on iOS.
 */
export async function closeAndroidSavePasswordPrompt(): Promise<boolean> {
    if (!driver.isAndroid) return false;
    const cancelButton = $('id=android:id/autofill_save_no');
    if (!(await cancelButton.isDisplayed())) return false;
    await cancelButton.click();
    await cancelButton.waitForDisplayed({ reverse: true, timeoutMsg: 'The "Save sign-in info?" prompt did not close.' });
    return true;
}

/**
 * Waits for a screen to show after navigating to it. If Android's "Save sign-in info?" prompt
 * pops up over it meanwhile (it can appear right after leaving the Login screen), it is closed first.
 */
export async function waitForScreen(screen: ChainablePromiseElement, screenName: string) {
    await driver.waitUntil(
        async () => {
            await closeAndroidSavePasswordPrompt();
            return screen.isDisplayed();
        },
        { timeoutMsg: `The ${screenName} screen did not open.` },
    );
}

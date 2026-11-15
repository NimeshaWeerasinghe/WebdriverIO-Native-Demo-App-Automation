import { env } from '../config/env';
import NativeAlert from '../pageobjects/NativeAlert';

/** The installed app's id: the Android package or the iOS bundle id. */
export function appId(): string {
    return driver.isIOS ? env.ios!.bundleId : env.android!.appPackage;
}

/** Hides the on-screen keyboard if it is open, so it cannot cover buttons or the tab bar. */
export async function hideKeyboard() {
    if (!(await driver.isKeyboardShown())) return;
    if (driver.isIOS) {
        // The iOS keyboard has no "hide" key. Tap the "Done" button above it, or else its return key.
        const doneButton = $('-ios predicate string:type == "XCUIElementTypeButton" AND name == "Done"');
        if (await doneButton.isDisplayed()) {
            await doneButton.click();
        } else {
            // Tapping an empty spot of the screen's scroll view (below the title) closes the keyboard in React Native.
            const { width } = await driver.getWindowRect();
            await driver.execute('mobile: tap', { x: Math.round(width / 2), y: 110 });
        }
    } else {
        await driver.hideKeyboard();
    }
    await driver.waitUntil(async () => !(await driver.isKeyboardShown()), {
        timeoutMsg: 'The on-screen keyboard did not close.',
    });
}

/**
 * The app stays open for the whole run, so a previous test may have left the keyboard
 * or an alert open (for example if it failed half-way). This closes both, so the next
 * test can navigate from a clean screen without restarting the app.
 */
export async function closeOverlays() {
    await closeAndroidSavePasswordPrompt();
    await closeIosPasswordSuggestion({ waitForIt: false });
    await hideKeyboard();
    await NativeAlert.closeIfOpen();
}

/**
 * iOS shows a "Use Strong Password?" sheet when a password field gets focus. It covers the form
 * and swallows typed text, so close it when it appears. Does nothing on Android.
 * With waitForIt, it gives the sheet up to 3 seconds to slide in (right after focusing a field).
 */
export async function closeIosPasswordSuggestion({ waitForIt = true } = {}) {
    if (!driver.isIOS) return;
    const closeButton = $('~xmark');
    const shown = waitForIt
        ? await closeButton.waitForDisplayed({ timeout: 3000 }).catch(() => false)
        : await closeButton.isDisplayed();
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
 * pops up over it meanwhile, the prompt is closed and the wait continues.
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

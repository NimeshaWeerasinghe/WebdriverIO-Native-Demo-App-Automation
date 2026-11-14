import { env } from '../config/env';
import NativeAlert from '../pageobjects/NativeAlert';

/** The installed app's id: the Android package or the iOS bundle id. */
export function appId(): string {
    return driver.isIOS ? env.ios!.bundleId : env.android!.appPackage;
}

/** Hides the on-screen keyboard if it is open, so it cannot cover buttons or the tab bar. */
export async function hideKeyboard() {
    if (await driver.isKeyboardShown()) {
        await driver.hideKeyboard();
    }
}

/**
 * The app stays open for the whole run, so a previous test may have left the keyboard
 * or an alert open (for example if it failed half-way). This closes both, so the next
 * test can navigate from a clean screen without restarting the app.
 */
export async function closeOverlays() {
    await hideKeyboard();
    await NativeAlert.closeIfOpen();
}

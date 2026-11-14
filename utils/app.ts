import { env } from '../config/env';
import TabBar from '../pageobjects/TabBar';

/** The installed app's id: the Android package or the iOS bundle id. */
export function appId(): string {
    return driver.isIOS ? env.ios!.bundleId : env.android!.appPackage;
}

/**
 * Closes and reopens the app so every test starts from a clean state
 * (empty forms, Home tab) and no test depends on another one.
 */
export async function restartApp() {
    await driver.terminateApp(appId());
    await driver.activateApp(appId());
    await TabBar.waitForTabBarShown();
}

/** Hides the on-screen keyboard if it is open, so it cannot cover buttons. */
export async function hideKeyboard() {
    if (await driver.isKeyboardShown()) {
        await driver.hideKeyboard();
    }
}

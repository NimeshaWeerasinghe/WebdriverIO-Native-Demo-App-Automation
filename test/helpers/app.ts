import TabBar from '../screens/TabBar';

const APP_PACKAGE = 'com.wdiodemoapp';

/**
 * Closes and reopens the app so every test starts from a clean state
 * (empty forms, Home tab) and no test depends on another one.
 */
export async function restartApp() {
    await driver.terminateApp(APP_PACKAGE);
    await driver.activateApp(APP_PACKAGE);
    await TabBar.waitForTabBarShown();
}

/** Hides the on-screen keyboard if it is open, so it cannot cover buttons. */
export async function hideKeyboard() {
    if (await driver.isKeyboardShown()) {
        await driver.hideKeyboard();
    }
}

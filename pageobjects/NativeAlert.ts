import { forPlatform } from '../utils/platform';

/**
 * A native alert dialog (the app shows one after a successful login,
 * a successful sign-up, and when the "Active" button is tapped).
 * Alerts are OS dialogs, so their locators differ per platform.
 */
class NativeAlert {
    get title() {
        return $(
            forPlatform({
                // React Native renders the Android title in its own view, so it has the app's id, not android:id/alertTitle.
                android: 'id=com.wdiodemoapp:id/alert_title',
                ios: '-ios class chain:**/XCUIElementTypeAlert/**/XCUIElementTypeStaticText[1]',
            }),
        );
    }

    get message() {
        return $(
            forPlatform({
                android: 'id=android:id/message',
                ios: '-ios class chain:**/XCUIElementTypeAlert/**/XCUIElementTypeStaticText[2]',
            }),
        );
    }

    get okButton() {
        return $(forPlatform({ android: 'id=android:id/button1', ios: '~OK' }));
    }

    async waitForShown() {
        await this.title.waitForDisplayed({ timeoutMsg: 'Expected a native alert, but none was shown.' });
    }

    async waitForClosed() {
        await this.title.waitForDisplayed({ reverse: true, timeoutMsg: 'The native alert did not close.' });
    }

    /** Closes the alert if one is open; does nothing (and does not wait) otherwise. */
    async closeIfOpen() {
        if (await this.title.isDisplayed()) {
            await this.tapOk();
        }
    }

    async tapOk() {
        await this.okButton.click();
        await this.waitForClosed();
    }
}

export default new NativeAlert();

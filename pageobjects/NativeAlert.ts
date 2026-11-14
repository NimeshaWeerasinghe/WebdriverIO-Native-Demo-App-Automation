import { AlertLocators } from '../locators/alert.locators';
import { forPlatform } from '../utils/platform';

/**
 * A native alert dialog (the app shows one after a successful login,
 * a successful sign-up, and when the "Active" button is tapped).
 */
class NativeAlert {
    get title() {
        return $(forPlatform(AlertLocators.title));
    }

    get message() {
        return $(forPlatform(AlertLocators.message));
    }

    get okButton() {
        return $(forPlatform(AlertLocators.okButton));
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

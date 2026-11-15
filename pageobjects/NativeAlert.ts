/**
 * A native alert dialog (the app shows one after a successful login,
 * a successful sign-up, and when the "Active" button is tapped).
 *
 * Android: React Native shows an Android dialog, read through its resource ids.
 * iOS: the alert is a system alert, read through Appium's alert API
 * (its text is the title and the message, one per line).
 */
class NativeAlert {
    // React Native renders the Android title in its own view, so it has the app's id, not android:id/alertTitle.
    private get androidTitle() {
        return $('id=com.wdiodemoapp:id/alert_title');
    }

    private get androidMessage() {
        return $('id=android:id/message');
    }

    private get androidOkButton() {
        return $('id=android:id/button1');
    }

    /** Checks right now, without waiting. */
    async isShown(): Promise<boolean> {
        if (driver.isIOS) {
            return (await readIosAlertText()) !== undefined;
        }
        return this.androidTitle.isDisplayed();
    }

    async waitForShown() {
        await driver.waitUntil(() => this.isShown(), { timeoutMsg: 'Expected a native alert, but none was shown.' });
    }

    async waitForClosed() {
        await driver.waitUntil(async () => !(await this.isShown()), { timeoutMsg: 'The native alert did not close.' });
    }

    async getTitle(): Promise<string> {
        return (await this.getTexts()).title;
    }

    async getMessage(): Promise<string> {
        return (await this.getTexts()).message;
    }

    /** Closes the alert if one is open; does nothing (and does not wait) otherwise. */
    async closeIfOpen() {
        if (await this.isShown()) {
            await this.tapOk();
        }
    }

    async tapOk() {
        if (driver.isIOS) {
            await driver.acceptAlert();
        } else {
            await this.androidOkButton.click();
        }
        await this.waitForClosed();
    }

    private async getTexts() {
        if (driver.isIOS) {
            const [title, ...messageLines] = (await driver.getAlertText()).split('\n');
            return { title, message: messageLines.join('\n') };
        }
        return { title: await this.androidTitle.getText(), message: await this.androidMessage.getText() };
    }
}

/** Returns the iOS alert text, or undefined when no alert is open. Any other error is passed on. */
async function readIosAlertText(): Promise<string | undefined> {
    try {
        return await driver.getAlertText();
    } catch (error) {
        if (/no such alert/i.test(`${(error as Error).name} ${(error as Error).message}`)) {
            return undefined;
        }
        throw error;
    }
}

export default new NativeAlert();

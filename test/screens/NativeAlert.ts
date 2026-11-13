/**
 * A native Android alert dialog (the app shows one after a successful login,
 * a successful sign-up, and when the "Active" button is tapped).
 */
class NativeAlert {
    // React Native renders the alert title in its own TextView, so it has the app's id, not Android's.
    get title() {
        return $('id=com.wdiodemoapp:id/alert_title');
    }

    get message() {
        return $('id=android:id/message');
    }

    get okButton() {
        return $('id=android:id/button1');
    }

    async waitForShown() {
        await this.title.waitForDisplayed();
    }

    async waitForClosed() {
        await this.title.waitForDisplayed({ reverse: true });
    }

    async tapOk() {
        await this.okButton.click();
        await this.waitForClosed();
    }
}

export default new NativeAlert();

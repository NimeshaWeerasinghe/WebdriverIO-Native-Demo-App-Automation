/**
 * A native Android alert dialog (the app shows one after a successful login,
 * a successful sign-up, and when the "Active" button is tapped).
 */
class NativeAlert {
    get title() {
        return $('id=android:id/alertTitle');
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

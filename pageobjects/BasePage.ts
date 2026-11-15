import { closeAndroidSavePasswordPrompt, closeOverlays, ensureAppInForeground, hideKeyboard } from '../utils/app';

/**
 * What every screen has in common: knowing whether it is showing, and opening it
 * from whatever state the previous test left the app in, without restarting the app.
 */
export default abstract class BasePage {
    /** The element that identifies this screen. */
    abstract get screen(): ChainablePromiseElement;

    /** The screen's title: plain text that is safe to tap (used to close the iOS keyboard). */
    abstract get title(): ChainablePromiseElement;

    /** Name used in error messages, e.g. "Forms". */
    protected abstract readonly screenName: string;

    /** Taps whatever leads to this screen (usually a tab). */
    protected abstract navigate(): Promise<void>;

    /** Opens the screen. Skips the navigation when the screen is already showing. */
    async open() {
        await ensureAppInForeground();
        await closeOverlays();
        if (!(await this.screen.isDisplayed())) {
            await this.navigate();
        }
        await this.waitForScreen();
    }

    /** Closes the keyboard; on iOS it may need a tap on this screen's title. */
    async hideKeyboard() {
        await hideKeyboard(this.title);
    }

    /**
     * Waits for the screen to show. If Android's "Save sign-in info?" prompt pops up over it
     * meanwhile (it can appear right after leaving the Login screen), the prompt is closed first.
     */
    private async waitForScreen() {
        await driver.waitUntil(
            async () => {
                await closeAndroidSavePasswordPrompt();
                return this.screen.isDisplayed();
            },
            { timeoutMsg: `The ${this.screenName} screen did not open.` },
        );
    }
}

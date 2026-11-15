import { closeIosPasswordSuggestion, closeOverlays, ensureAppInForeground, hideKeyboard, waitForScreen } from '../utils/app';
import { forPlatform } from '../utils/platform';
import TabBar from './TabBar';

/**
 * Login tab: one form with two modes, "Login" and "Sign up".
 * Elements are found by accessibility id (`~`), which is the same on Android and iOS.
 */
class LoginPage {
    get screen() {
        return $('~Login-screen');
    }

    /** The title has no accessibility id, so it is found by its text. */
    get title() {
        return $(
            forPlatform({
                android: 'android=new UiSelector().text("Login / Sign up Form")',
                ios: '-ios predicate string:type == "XCUIElementTypeStaticText" AND label == "Login / Sign up Form"',
            }),
        );
    }

    get loginModeButton() {
        return $('~button-login-container');
    }

    get signUpModeButton() {
        return $('~button-sign-up-container');
    }

    get emailInput() {
        return $('~input-email');
    }

    get passwordInput() {
        return $('~input-password');
    }

    get repeatPasswordInput() {
        return $('~input-repeat-password');
    }

    get loginButton() {
        return $('~button-LOGIN');
    }

    get signUpButton() {
        return $('~button-SIGN UP');
    }

    /** Validation messages have no accessibility id, so they are found by their visible text. */
    errorMessage(text: string) {
        return $(
            forPlatform({
                android: `android=new UiSelector().text("${text}")`,
                ios: `-ios predicate string:label == "${text}"`,
            }),
        );
    }

    /** Opens the Login tab in "Login" mode, whatever screen or mode the app was left in. */
    async openLogin() {
        await this.open();
        await this.loginModeButton.click();
        await this.repeatPasswordInput.waitForDisplayed({ reverse: true, timeoutMsg: 'The Login form did not open.' });
    }

    /** Opens the Login tab in "Sign up" mode, whatever screen or mode the app was left in. */
    async openSignUp() {
        await this.open();
        await this.signUpModeButton.click();
        await this.repeatPasswordInput.waitForDisplayed({ timeoutMsg: 'The Sign up form did not open.' });
    }

    /** Opens the Login screen from wherever the app is. Skips the tab tap when it is already showing. */
    async open() {
        await ensureAppInForeground();
        await closeOverlays();
        if (!(await this.screen.isDisplayed())) {
            await TabBar.openLogin();
        }
        await waitForScreen(this.screen, 'Login');
    }

    async login(email: string, password: string) {
        await this.emailInput.setValue(email);
        await this.typePassword(this.passwordInput, password);
        await hideKeyboard(this.title);
        await this.loginButton.click();
    }

    /** Focuses a password field first, so the iOS strong-password sheet can be closed before typing. */
    async typePassword(field: ChainablePromiseElement, value: string) {
        await field.click();
        await closeIosPasswordSuggestion();
        await field.setValue(value);
    }

    async signUp(email: string, password: string, repeatPassword: string) {
        await this.emailInput.setValue(email);
        await this.typePassword(this.passwordInput, password);
        await this.typePassword(this.repeatPasswordInput, repeatPassword);
        await hideKeyboard(this.title);
        await this.signUpButton.click();
    }
}

export default new LoginPage();

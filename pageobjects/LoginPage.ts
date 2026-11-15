import { closeAndroidAutofillSuggestions, closeIosPasswordSuggestion, closeOverlays, ensureAppInForeground, hideKeyboard, waitForScreen } from '../utils/app';
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
                ios: '-ios predicate string:type == "XCUIElementTypeStaticText" AND label == "Login / Sign up Form" AND visible == 1',
            }),
        );
    }

    /** The envelope icon in front of the email field (an icon-font character, it has no id). */
    get emailIcon() {
        return $(
            forPlatform({
                android: 'android=new UiSelector().text("\u{F01F0}")',
                ios: '-ios predicate string:type == "XCUIElementTypeStaticText" AND label == "\u{F01F0}" AND visible == 1',
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
        await this.fillLoginForm(email, password);
        await this.closeKeyboard();
        await this.loginButton.click();
    }

    /** Types the credentials without submitting (the keyboard may stay open). */
    async fillLoginForm(email: string, password: string) {
        await this.typeText(this.emailInput, email);
        await this.typePassword(this.passwordInput, password);
    }

    /**
     * On iOS the keyboard closes when plain content is tapped. That is the title, unless the keyboard
     * has pushed the title off-screen; then the email icon, which always stays visible.
     */
    async closeKeyboard() {
        const tapTarget = (await this.title.isDisplayed()) ? this.title : this.emailIcon;
        await hideKeyboard(tapTarget);
    }

    /** Clears the field, then types the value. An empty value just leaves the field empty. */
    async typeText(field: ChainablePromiseElement, value: string) {
        if (value === '') {
            await field.clearValue();
            // An empty, focused sign-in field can open the autofill suggestion list on some phones.
            await closeAndroidAutofillSuggestions();
        } else {
            await field.setValue(value);
        }
    }

    /**
     * On iOS, focuses the field first so the "Use Strong Password?" sheet can be closed before typing.
     * On Android the field is not tapped: tapping an empty password field on some phones (e.g. Samsung Pass)
     * opens an autofill suggestion list that covers the next field.
     */
    async typePassword(field: ChainablePromiseElement, value: string) {
        if (driver.isIOS) {
            await field.click();
            await closeIosPasswordSuggestion();
        }
        await this.typeText(field, value);
    }

    async signUp(email: string, password: string, repeatPassword: string) {
        await this.typeText(this.emailInput, email);
        await this.typePassword(this.passwordInput, password);
        await this.typePassword(this.repeatPasswordInput, repeatPassword);
        await this.closeKeyboard();
        await this.signUpButton.click();
    }
}

export default new LoginPage();

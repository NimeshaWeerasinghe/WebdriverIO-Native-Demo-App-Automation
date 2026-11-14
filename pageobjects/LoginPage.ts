import { hideKeyboard } from '../utils/app';
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
        await this.openTab();
        await this.loginModeButton.click();
        await this.repeatPasswordInput.waitForDisplayed({ reverse: true, timeoutMsg: 'The Login form did not open.' });
    }

    /** Opens the Login tab in "Sign up" mode, whatever screen or mode the app was left in. */
    async openSignUp() {
        await this.openTab();
        await this.signUpModeButton.click();
        await this.repeatPasswordInput.waitForDisplayed({ timeoutMsg: 'The Sign up form did not open.' });
    }

    async openTab() {
        await TabBar.openLogin();
        await this.screen.waitForDisplayed({ timeoutMsg: 'The Login screen did not open.' });
    }

    async login(email: string, password: string) {
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await hideKeyboard();
        await this.loginButton.click();
    }

    async signUp(email: string, password: string, repeatPassword: string) {
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await this.repeatPasswordInput.setValue(repeatPassword);
        await hideKeyboard();
        await this.signUpButton.click();
    }
}

export default new LoginPage();

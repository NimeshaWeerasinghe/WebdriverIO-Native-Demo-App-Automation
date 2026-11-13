import { hideKeyboard } from '../helpers/app';
import TabBar from './TabBar';

/**
 * Login tab: one form with two modes, "Login" and "Sign up".
 * Elements are found by accessibility id (the `~` prefix), which the app sets on purpose for testing.
 */
class LoginScreen {
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
        return $(`android=new UiSelector().text("${text}")`);
    }

    async open() {
        await TabBar.openLogin();
        await this.screen.waitForDisplayed();
    }

    async openSignUp() {
        await this.open();
        await this.signUpModeButton.click();
        await this.repeatPasswordInput.waitForDisplayed();
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

export default new LoginScreen();

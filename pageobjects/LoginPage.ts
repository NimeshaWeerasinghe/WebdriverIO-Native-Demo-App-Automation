import { LoginLocators } from '../locators/login.locators';
import { hideKeyboard } from '../utils/app';
import { forPlatform } from '../utils/platform';
import TabBar from './TabBar';

/**
 * Login tab: one form with two modes, "Login" and "Sign up".
 */
class LoginPage {
    get screen() {
        return $(forPlatform(LoginLocators.screen));
    }

    get signUpModeButton() {
        return $(forPlatform(LoginLocators.signUpModeButton));
    }

    get emailInput() {
        return $(forPlatform(LoginLocators.emailInput));
    }

    get passwordInput() {
        return $(forPlatform(LoginLocators.passwordInput));
    }

    get repeatPasswordInput() {
        return $(forPlatform(LoginLocators.repeatPasswordInput));
    }

    get loginButton() {
        return $(forPlatform(LoginLocators.loginButton));
    }

    get signUpButton() {
        return $(forPlatform(LoginLocators.signUpButton));
    }

    errorMessage(text: string) {
        return $(forPlatform(LoginLocators.errorMessage(text)));
    }

    async open() {
        await TabBar.openLogin();
        await this.screen.waitForDisplayed({ timeoutMsg: 'The Login screen did not open.' });
    }

    async openSignUp() {
        await this.open();
        await this.signUpModeButton.click();
        await this.repeatPasswordInput.waitForDisplayed({ timeoutMsg: 'The Sign up form did not open.' });
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

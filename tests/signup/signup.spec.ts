import LoginPage from '../../pageobjects/LoginPage';
import NativeAlert from '../../pageobjects/NativeAlert';
import FormsPage from '../../pageobjects/FormsPage';
import { invalidInput, messages, minimumLengthPassword, users } from '../data/testData';

describe('Sign up', () => {
    beforeEach(async () => {
        await LoginPage.openSignUp();
    });

    it('SIGNUP-01: shows a success dialog for valid details', async () => {
        const { email, password } = users.newUser;
        await LoginPage.signUp(email, password, password);

        await NativeAlert.waitForShown();
        expect(await NativeAlert.getTitle()).toBe(messages.signUpSuccess.title);
        expect(await NativeAlert.getMessage()).toBe(messages.signUpSuccess.message);
        await NativeAlert.tapOk();
    });

    it('SIGNUP-02: rejects an invalid email address', async () => {
        const { password } = users.newUser;
        await LoginPage.signUp(invalidInput.email, password, password);

        await expect(LoginPage.errorMessage(messages.invalidEmail)).toBeDisplayed();
        expect(await NativeAlert.isShown()).toBe(false);
    });

    it('SIGNUP-03: rejects passwords that do not match', async () => {
        const { email, password } = users.newUser;
        await LoginPage.signUp(email, password, invalidInput.otherPassword);

        await expect(LoginPage.errorMessage(messages.passwordsDoNotMatch)).toBeDisplayed();
        expect(await NativeAlert.isShown()).toBe(false);
    });

    it('SIGNUP-04: shows the validation messages when all fields are empty', async () => {
        await LoginPage.signUp('', '', '');

        await expect(LoginPage.errorMessage(messages.invalidEmail)).toBeDisplayed();
        await expect(LoginPage.errorMessage(messages.shortPassword)).toBeDisplayed();
        expect(await NativeAlert.isShown()).toBe(false);
    });

    it('SIGNUP-05: rejects an email without a domain', async () => {
        const { password } = users.newUser;
        await LoginPage.signUp(invalidInput.emailWithoutDomain, password, password);

        await expect(LoginPage.errorMessage(messages.invalidEmail)).toBeDisplayed();
        // The password is valid, so only the email message may show (proves the form was re-validated).
        await expect(LoginPage.errorMessage(messages.shortPassword)).not.toBeDisplayed();
        expect(await NativeAlert.isShown()).toBe(false);
    });

    // Current behaviour: the app does not trim spaces around the email (reported in the README as a bug).
    it('SIGNUP-06: rejects an email with leading and trailing spaces', async () => {
        const { password } = users.newUser;
        await LoginPage.signUp(invalidInput.emailWithSpaces, password, password);

        await expect(LoginPage.errorMessage(messages.invalidEmail)).toBeDisplayed();
        await expect(LoginPage.errorMessage(messages.shortPassword)).not.toBeDisplayed();
        expect(await NativeAlert.isShown()).toBe(false);
    });

    it('SIGNUP-07: rejects a password of exactly 7 characters', async () => {
        const { email } = users.newUser;
        await LoginPage.signUp(email, invalidInput.shortPassword, invalidInput.shortPassword);

        await expect(LoginPage.errorMessage(messages.shortPassword)).toBeDisplayed();
        // The email is valid, so its message must be gone (proves the form was re-validated).
        await expect(LoginPage.errorMessage(messages.invalidEmail)).not.toBeDisplayed();
        expect(await NativeAlert.isShown()).toBe(false);
    });

    it('SIGNUP-08: accepts a password of exactly 8 characters', async () => {
        const { email } = users.newUser;
        await LoginPage.signUp(email, minimumLengthPassword, minimumLengthPassword);

        await NativeAlert.waitForShown();
        expect(await NativeAlert.getTitle()).toBe(messages.signUpSuccess.title);
        await NativeAlert.tapOk();
        expect(await LoginPage.errorMessage(messages.shortPassword).isDisplayed()).toBe(false);
    });

    it('SIGNUP-09: keeps the form usable after navigating away and back', async () => {
        const { email, password } = users.newUser;
        await LoginPage.typeText(LoginPage.emailInput, email);
        await LoginPage.closeKeyboard();

        await FormsPage.open();
        await LoginPage.open();

        // Still in "Sign up" mode, and the typed email is kept.
        await expect(LoginPage.repeatPasswordInput).toBeDisplayed();
        await expect(LoginPage.emailInput).toHaveText(email);

        await LoginPage.signUp(email, password, password);
        await NativeAlert.waitForShown();
        expect(await NativeAlert.getTitle()).toBe(messages.signUpSuccess.title);
        await NativeAlert.tapOk();
    });
});

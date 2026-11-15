import LoginPage from '../../pageobjects/LoginPage';
import NativeAlert from '../../pageobjects/NativeAlert';
import { invalidInput, messages, users } from '../data/testData';

describe('Login', () => {
    beforeEach(async () => {
        await LoginPage.openLogin();
    });

    it('LOGIN-01: shows a success dialog for a valid email and password', async () => {
        await LoginPage.login(users.valid.email, users.valid.password);

        await NativeAlert.waitForShown();
        expect(await NativeAlert.getTitle()).toBe(messages.loginSuccess.title);
        expect(await NativeAlert.getMessage()).toBe(messages.loginSuccess.message);
        await NativeAlert.tapOk();
    });

    it('LOGIN-02: rejects an invalid email address', async () => {
        await LoginPage.login(invalidInput.email, users.valid.password);

        await expect(LoginPage.errorMessage(messages.invalidEmail)).toBeDisplayed();
        expect(await NativeAlert.isShown()).toBe(false);
    });

    it('LOGIN-03: rejects a password shorter than 8 characters', async () => {
        await LoginPage.login(users.valid.email, invalidInput.shortPassword);

        await expect(LoginPage.errorMessage(messages.shortPassword)).toBeDisplayed();
        expect(await NativeAlert.isShown()).toBe(false);
    });
});

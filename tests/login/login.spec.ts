import LoginPage from '../../pageobjects/LoginPage';
import NativeAlert from '../../pageobjects/NativeAlert';
import { invalidInput, messages, users } from '../data/testData';

describe('Login', () => {
    beforeEach(async () => {
        await LoginPage.openLogin();
    });

    it('shows a success dialog for a valid email and password', async () => {
        await LoginPage.login(users.valid.email, users.valid.password);

        await NativeAlert.waitForShown();
        await expect(NativeAlert.title).toHaveText(messages.loginSuccess.title);
        await expect(NativeAlert.message).toHaveText(messages.loginSuccess.message);
        await NativeAlert.tapOk();
    });

    it('rejects an invalid email address', async () => {
        await LoginPage.login(invalidInput.email, users.valid.password);

        await expect(LoginPage.errorMessage(messages.invalidEmail)).toBeDisplayed();
        await expect(NativeAlert.title).not.toBeDisplayed();
    });

    it('rejects a password shorter than 8 characters', async () => {
        await LoginPage.login(users.valid.email, invalidInput.shortPassword);

        await expect(LoginPage.errorMessage(messages.shortPassword)).toBeDisplayed();
        await expect(NativeAlert.title).not.toBeDisplayed();
    });
});

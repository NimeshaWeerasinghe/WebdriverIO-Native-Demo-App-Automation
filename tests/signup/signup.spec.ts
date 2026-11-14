import LoginPage from '../../pageobjects/LoginPage';
import NativeAlert from '../../pageobjects/NativeAlert';
import { invalidInput, messages, users } from '../data/testData';

describe('Sign up', () => {
    beforeEach(async () => {
        await LoginPage.openSignUp();
    });

    it('shows a success dialog for valid details', async () => {
        const { email, password } = users.newUser;
        await LoginPage.signUp(email, password, password);

        await NativeAlert.waitForShown();
        await expect(NativeAlert.title).toHaveText(messages.signUpSuccess.title);
        await expect(NativeAlert.message).toHaveText(messages.signUpSuccess.message);
        await NativeAlert.tapOk();
    });

    it('rejects an invalid email address', async () => {
        const { password } = users.newUser;
        await LoginPage.signUp(invalidInput.email, password, password);

        await expect(LoginPage.errorMessage(messages.invalidEmail)).toBeDisplayed();
        await expect(NativeAlert.title).not.toBeDisplayed();
    });

    it('rejects passwords that do not match', async () => {
        const { email, password } = users.newUser;
        await LoginPage.signUp(email, password, invalidInput.otherPassword);

        await expect(LoginPage.errorMessage(messages.passwordsDoNotMatch)).toBeDisplayed();
        await expect(NativeAlert.title).not.toBeDisplayed();
    });
});

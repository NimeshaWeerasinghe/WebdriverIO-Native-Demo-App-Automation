import LoginPage from '../../pageobjects/LoginPage';
import NativeAlert from '../../pageobjects/NativeAlert';
import { invalidInput, messages, users } from '../data/testData';

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
});

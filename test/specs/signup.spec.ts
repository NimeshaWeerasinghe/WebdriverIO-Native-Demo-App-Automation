import { restartApp } from '../helpers/app';
import LoginScreen from '../screens/LoginScreen';
import NativeAlert from '../screens/NativeAlert';

describe('Sign up', () => {
    beforeEach(async () => {
        await restartApp();
        await LoginScreen.openSignUp();
    });

    it('shows a success dialog for valid details', async () => {
        await LoginScreen.signUp('new.user@example.com', 'Password123', 'Password123');

        await NativeAlert.waitForShown();
        await expect(NativeAlert.title).toHaveText('Signed Up!');
        await expect(NativeAlert.message).toHaveText('You successfully signed up!');
        await NativeAlert.tapOk();
    });

    it('rejects an invalid email address', async () => {
        await LoginScreen.signUp('not-an-email', 'Password123', 'Password123');

        await expect(LoginScreen.errorMessage('Please enter a valid email address')).toBeDisplayed();
        await expect(NativeAlert.title).not.toBeDisplayed();
    });

    it('rejects passwords that do not match', async () => {
        await LoginScreen.signUp('new.user@example.com', 'Password123', 'Password456');

        await expect(LoginScreen.errorMessage('Please enter the same password')).toBeDisplayed();
        await expect(NativeAlert.title).not.toBeDisplayed();
    });
});

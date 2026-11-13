import { restartApp } from '../helpers/app';
import LoginScreen from '../screens/LoginScreen';
import NativeAlert from '../screens/NativeAlert';

describe('Login', () => {
    beforeEach(async () => {
        await restartApp();
        await LoginScreen.open();
    });

    it('shows a success dialog for a valid email and password', async () => {
        await LoginScreen.login('test.user@example.com', 'Password123');

        await NativeAlert.waitForShown();
        await expect(NativeAlert.title).toHaveText('Success');
        await expect(NativeAlert.message).toHaveText('You are logged in!');
        await NativeAlert.tapOk();
    });

    it('rejects an invalid email address', async () => {
        await LoginScreen.login('not-an-email', 'Password123');

        await expect(LoginScreen.errorMessage('Please enter a valid email address')).toBeDisplayed();
        await expect(NativeAlert.title).not.toBeDisplayed();
    });

    it('rejects a password shorter than 8 characters', async () => {
        await LoginScreen.login('test.user@example.com', 'Pass123');

        await expect(LoginScreen.errorMessage('Please enter at least 8 characters')).toBeDisplayed();
        await expect(NativeAlert.title).not.toBeDisplayed();
    });
});

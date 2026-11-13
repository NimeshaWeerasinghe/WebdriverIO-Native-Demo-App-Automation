import { restartApp } from '../helpers/app';
import FormsScreen from '../screens/FormsScreen';
import NativeAlert from '../screens/NativeAlert';

describe('Forms', () => {
    beforeEach(async () => {
        await restartApp();
        await FormsScreen.open();
    });

    it('echoes back the text typed into the input field', async () => {
        await FormsScreen.textInput.setValue('Hello WebdriverIO');

        await expect(FormsScreen.typedTextResult).toHaveText('Hello WebdriverIO');
    });

    it('toggles the switch and updates its label', async () => {
        await expect(FormsScreen.switchLabel).toHaveText('Click to turn the switch ON');
        expect(await FormsScreen.isSwitchOn()).toBe(false);

        await FormsScreen.switchToggle.click();
        await expect(FormsScreen.switchLabel).toHaveText('Click to turn the switch OFF');
        expect(await FormsScreen.isSwitchOn()).toBe(true);

        await FormsScreen.switchToggle.click();
        await expect(FormsScreen.switchLabel).toHaveText('Click to turn the switch ON');
        expect(await FormsScreen.isSwitchOn()).toBe(false);
    });

    it('opens a native alert when the "Active" button is tapped', async () => {
        await FormsScreen.activeButton.click();

        await NativeAlert.waitForShown();
        await expect(NativeAlert.title).toHaveText('This button is');
        await expect(NativeAlert.message).toHaveText('This button is active');
        await NativeAlert.tapOk();
    });
});

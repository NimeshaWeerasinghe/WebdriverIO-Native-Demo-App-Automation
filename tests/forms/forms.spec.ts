import FormsPage from '../../pageobjects/FormsPage';
import NativeAlert from '../../pageobjects/NativeAlert';
import { messages } from '../data/testData';

describe('Forms', () => {
    beforeEach(async () => {
        await FormsPage.open();
    });

    it('echoes back the text typed into the input field', async () => {
        const text = 'Hello WebdriverIO';
        await FormsPage.textInput.setValue(text);

        await expect(FormsPage.typedTextResult).toHaveText(text);
    });

    it('toggles the switch and updates its label', async () => {
        await FormsPage.turnSwitchOff();

        await expect(FormsPage.switchLabel).toHaveText(messages.switchOff);
        expect(await FormsPage.isSwitchOn()).toBe(false);

        await FormsPage.switchToggle.click();
        await expect(FormsPage.switchLabel).toHaveText(messages.switchOn);
        expect(await FormsPage.isSwitchOn()).toBe(true);

        await FormsPage.switchToggle.click();
        await expect(FormsPage.switchLabel).toHaveText(messages.switchOff);
        expect(await FormsPage.isSwitchOn()).toBe(false);
    });

    it('opens a native alert when the "Active" button is tapped', async () => {
        await FormsPage.activeButton.click();

        await NativeAlert.waitForShown();
        await expect(NativeAlert.title).toHaveText(messages.activeButton.title);
        await expect(NativeAlert.message).toHaveText(messages.activeButton.message);
        await NativeAlert.tapOk();
    });
});

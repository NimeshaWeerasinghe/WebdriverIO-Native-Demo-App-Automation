import FormsPage from '../../pageobjects/FormsPage';
import NativeAlert from '../../pageobjects/NativeAlert';
import { messages } from '../data/testData';

describe('Forms', () => {
    beforeEach(async () => {
        await FormsPage.open();
    });

    it('FORMS-01: echoes back the text typed into the input field', async () => {
        const text = 'Hello WebdriverIO';
        await FormsPage.typeText(text);

        await expect(FormsPage.typedTextResult).toHaveText(text);
    });

    it('FORMS-02: toggles the switch and updates its label', async () => {
        await FormsPage.turnSwitchOff();

        await expect(FormsPage.switchLabel).toHaveText(messages.switchOff);
        expect(await FormsPage.getSwitchState()).toBe('OFF');

        await FormsPage.switchToggle.click();
        await expect(FormsPage.switchLabel).toHaveText(messages.switchOn);
        expect(await FormsPage.getSwitchState()).toBe('ON');

        await FormsPage.switchToggle.click();
        await expect(FormsPage.switchLabel).toHaveText(messages.switchOff);
        expect(await FormsPage.getSwitchState()).toBe('OFF');
    });

    it('FORMS-03: opens a native alert when the "Active" button is tapped', async () => {
        await FormsPage.activeButton.click();

        await NativeAlert.waitForShown();
        expect(await NativeAlert.getTitle()).toBe(messages.activeButton.title);
        expect(await NativeAlert.getMessage()).toBe(messages.activeButton.message);
        await NativeAlert.tapOk();
    });
});

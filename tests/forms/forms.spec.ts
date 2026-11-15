import FormsPage from '../../pageobjects/FormsPage';
import NativeAlert from '../../pageobjects/NativeAlert';
import LoginPage from '../../pageobjects/LoginPage';
import { formsInput, messages } from '../data/testData';

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

    it('FORMS-04: accepts long text up to the 30-character limit', async () => {
        const expected = formsInput.longText.slice(0, formsInput.maxLength);
        await FormsPage.typeText(formsInput.longText);

        await expect(FormsPage.textInput).toHaveText(expected);
        await expect(FormsPage.typedTextResult).toHaveText(expected);
    });

    it('FORMS-05: echoes special characters and numbers unchanged', async () => {
        await FormsPage.typeText(formsInput.specialCharacters);

        await expect(FormsPage.typedTextResult).toHaveText(formsInput.specialCharacters);
    });

    it('FORMS-06: clears the echoed text when the input is cleared', async () => {
        await FormsPage.typeText(formsInput.textBeforeNavigation);
        await expect(FormsPage.typedTextResult).toHaveText(formsInput.textBeforeNavigation);

        await FormsPage.clearText();
        await expect(FormsPage.typedTextResult).toHaveText('');
    });

    it('FORMS-07: keeps the typed text after navigating away and back', async () => {
        await FormsPage.typeText(formsInput.textBeforeNavigation);

        await LoginPage.open();
        await FormsPage.open();

        await expect(FormsPage.typedTextResult).toHaveText(formsInput.textBeforeNavigation);

        // The field is still usable.
        await FormsPage.typeText(formsInput.textAfterNavigation);
        await expect(FormsPage.typedTextResult).toHaveText(formsInput.textAfterNavigation);
    });
});

import { FormsLocators } from '../locators/forms.locators';
import { forPlatform } from '../utils/platform';
import TabBar from './TabBar';

/**
 * Forms tab: a text input that is echoed back, a switch, a dropdown and two buttons.
 */
class FormsPage {
    get screen() {
        return $(forPlatform(FormsLocators.screen));
    }

    get textInput() {
        return $(forPlatform(FormsLocators.textInput));
    }

    get typedTextResult() {
        return $(forPlatform(FormsLocators.typedTextResult));
    }

    get switchToggle() {
        return $(forPlatform(FormsLocators.switchToggle));
    }

    get switchLabel() {
        return $(forPlatform(FormsLocators.switchLabel));
    }

    get activeButton() {
        return $(forPlatform(FormsLocators.activeButton));
    }

    async open() {
        await TabBar.openForms();
        await this.screen.waitForDisplayed({ timeoutMsg: 'The Forms screen did not open.' });
    }

    /** Android reports the switch state in "checked", iOS in "value" ("1" when on). */
    async isSwitchOn() {
        if (driver.isIOS) {
            return (await this.switchToggle.getAttribute('value')) === '1';
        }
        return (await this.switchToggle.getAttribute('checked')) === 'true';
    }
}

export default new FormsPage();

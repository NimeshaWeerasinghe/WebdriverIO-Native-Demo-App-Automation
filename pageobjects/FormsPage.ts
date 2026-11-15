import { waitForScreen } from '../utils/app';
import TabBar from './TabBar';

/**
 * Forms tab: a text input that is echoed back, a switch, a dropdown and two buttons.
 */
class FormsPage {
    get screen() {
        return $('~Forms-screen');
    }

    get textInput() {
        return $('~text-input');
    }

    get typedTextResult() {
        return $('~input-text-result');
    }

    get switchToggle() {
        return $('~switch');
    }

    get switchLabel() {
        return $('~switch-text');
    }

    get activeButton() {
        return $('~button-Active');
    }

    async open() {
        await TabBar.openForms();
        await waitForScreen(this.screen, 'Forms');
    }

    /** Puts the switch in the OFF state, since the app keeps its state between tests. */
    async turnSwitchOff() {
        if (await this.isSwitchOn()) {
            await this.switchToggle.click();
        }
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

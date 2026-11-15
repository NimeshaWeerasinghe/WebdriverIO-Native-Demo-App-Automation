import { closeOverlays, ensureAppInForeground, hideKeyboard, waitForScreen } from '../utils/app';
import { forPlatform } from '../utils/platform';
import TabBar from './TabBar';

export type SwitchState = 'ON' | 'OFF';

/**
 * Forms tab: a text input that is echoed back, a switch, a dropdown and two buttons.
 */
class FormsPage {
    get screen() {
        return $('~Forms-screen');
    }

    /** The title has no accessibility id, so it is found by its text. */
    get title() {
        return $(
            forPlatform({
                android: 'android=new UiSelector().text("Form components")',
                ios: '-ios predicate string:type == "XCUIElementTypeStaticText" AND label == "Form components"',
            }),
        );
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

    /** Opens the Forms screen from wherever the app is. Skips the tab tap when it is already showing. */
    async open() {
        await ensureAppInForeground();
        await closeOverlays();
        if (!(await this.screen.isDisplayed())) {
            await TabBar.openForms();
        }
        await waitForScreen(this.screen, 'Forms');
    }

    /** Types into the input field, then closes the keyboard so it does not cover other controls. */
    async typeText(text: string) {
        await this.textInput.setValue(text);
        await hideKeyboard(this.title);
    }

    /** Android reports the switch state in "checked", iOS in "value" ("1" when on). */
    async getSwitchState(): Promise<SwitchState> {
        const isOn = driver.isIOS
            ? (await this.switchToggle.getAttribute('value')) === '1'
            : (await this.switchToggle.getAttribute('checked')) === 'true';
        return isOn ? 'ON' : 'OFF';
    }

    /** Puts the switch in the OFF state, since the app keeps its state between tests. */
    async turnSwitchOff() {
        if ((await this.getSwitchState()) === 'ON') {
            await this.switchToggle.click();
        }
    }
}

export default new FormsPage();

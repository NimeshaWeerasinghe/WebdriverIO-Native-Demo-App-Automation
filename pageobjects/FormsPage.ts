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
                ios: '-ios predicate string:type == "XCUIElementTypeStaticText" AND label == "Form components" AND visible == 1',
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

    /** What to tap to open the dropdown: the whole field on Android, the chevron icon on iOS. */
    get dropdown() {
        return $(forPlatform({ android: '~Dropdown', ios: '~dropdown-chevron' }));
    }

    /** The text field inside the dropdown that shows the selected option. */
    get dropdownValue() {
        return $(
            forPlatform({
                android: 'android=new UiSelector().resourceId("text_input")',
                ios: '-ios class chain:**/XCUIElementTypeOther[`name == "Dropdown"`]/**/XCUIElementTypeTextField',
            }),
        );
    }

    /** Android: one row of the native option list, found by its text (the rows have no ids of their own). */
    private androidDropdownOption(option: string) {
        return $(`android=new UiSelector().resourceId("android:id/text1").text("${option}")`);
    }

    /** iOS shows the options in a picker wheel with a "Done" button. */
    private get iosPickerWheel() {
        return $('-ios class chain:**/XCUIElementTypePickerWheel');
    }

    private get iosPickerDoneButton() {
        return $('~done_button');
    }

    /** Opens the Forms screen from wherever the app is. Skips the tab tap when it is already showing. */
    async open() {
        await ensureAppInForeground();
        await closeOverlays();
        if (!(await this.screen.isDisplayed())) {
            await TabBar.tab('Forms').click();
        }
        await waitForScreen(this.screen, 'Forms');
    }

    /** Types into the input field, then closes the keyboard so it does not cover other controls. */
    async typeText(text: string) {
        await this.textInput.setValue(text);
        await hideKeyboard(this.title);
    }

    /** Empties the input field, then closes the keyboard. */
    async clearText() {
        await this.textInput.clearValue();
        await hideKeyboard(this.title);
    }

    /** Opens the dropdown, picks an option and waits until the dropdown shows it. */
    async selectDropdownOption(option: string) {
        await this.dropdown.click();
        if (driver.isIOS) {
            await this.iosPickerWheel.waitForDisplayed({ timeoutMsg: 'The dropdown picker did not open.' });
            await this.iosPickerWheel.setValue(option);
            await this.iosPickerDoneButton.click();
        } else {
            const row = this.androidDropdownOption(option);
            await row.waitForDisplayed({ timeoutMsg: `The dropdown option "${option}" was not shown.` });
            await row.click();
            await row.waitForDisplayed({ reverse: true, timeoutMsg: 'The dropdown list did not close.' });
        }
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

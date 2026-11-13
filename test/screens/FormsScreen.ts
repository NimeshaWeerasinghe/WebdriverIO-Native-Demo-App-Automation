import TabBar from './TabBar';

/**
 * Forms tab: a text input that is echoed back, a switch, a dropdown and two buttons.
 */
class FormsScreen {
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
        await this.screen.waitForDisplayed();
    }

    async isSwitchOn() {
        return (await this.switchToggle.getAttribute('checked')) === 'true';
    }
}

export default new FormsScreen();

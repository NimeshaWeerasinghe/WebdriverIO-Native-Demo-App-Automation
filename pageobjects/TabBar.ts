/**
 * The bottom tab bar that is visible on every screen of the app.
 */
class TabBar {
    get loginTab() {
        return $('~Login');
    }

    get formsTab() {
        return $('~Forms');
    }

    async waitForTabBarShown() {
        await this.loginTab.waitForDisplayed({ timeoutMsg: 'The app did not show its tab bar. Is the app launched?' });
    }

    async openLogin() {
        await this.loginTab.click();
    }

    async openForms() {
        await this.formsTab.click();
    }
}

export default new TabBar();

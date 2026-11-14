import { TabBarLocators } from '../locators/tabBar.locators';
import { forPlatform } from '../utils/platform';

/**
 * The bottom tab bar that is visible on every screen of the app.
 */
class TabBar {
    get loginTab() {
        return $(forPlatform(TabBarLocators.loginTab));
    }

    get formsTab() {
        return $(forPlatform(TabBarLocators.formsTab));
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

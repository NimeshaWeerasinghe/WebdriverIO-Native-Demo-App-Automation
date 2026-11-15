import { waitForScreen } from '../utils/app';

/** The tabs of the bottom tab bar, and the screen each one opens. (Webview is left out: it loads a live website.) */
const TABS = {
    Home: '~Home-screen',
    Login: '~Login-screen',
    Forms: '~Forms-screen',
    Swipe: '~Swipe-screen',
    Drag: '~Drag-drop-screen',
} as const;

export type TabName = keyof typeof TABS;
export const TAB_NAMES = Object.keys(TABS) as TabName[];

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

    tab(name: TabName) {
        return $(`~${name}`);
    }

    /** The screen that a tab opens. */
    screen(name: TabName) {
        return $(TABS[name]);
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

    /** Taps a tab and waits for its screen. */
    async open(name: TabName) {
        await this.tab(name).click();
        await waitForScreen(this.screen(name), name);
    }

    /** iOS marks the selected tab with value "1". Android does not expose which tab is selected. */
    async isSelectedOnIos(name: TabName) {
        return (await this.tab(name).getAttribute('value')) === '1';
    }
}

export default new TabBar();

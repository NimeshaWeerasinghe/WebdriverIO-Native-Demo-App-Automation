import FormsPage from '../../pageobjects/FormsPage';
import TabBar, { TAB_NAMES } from '../../pageobjects/TabBar';
import { appId, closeOverlays, ensureAppInForeground, RUNNING_IN_FOREGROUND } from '../../utils/app';
import { formsInput } from '../data/testData';

describe('Mobile interactions', () => {
    beforeEach(async () => {
        await ensureAppInForeground();
        await closeOverlays();
    });

    it('MOBILE-01: opens the right screen for every tab', async () => {
        for (const name of TAB_NAMES) {
            await TabBar.open(name);
            await expect(TabBar.screen(name)).toBeDisplayed();
            // Android does not expose which tab is selected, so this check runs on iOS only.
            if (driver.isIOS) {
                expect(await TabBar.isSelectedOnIos(name)).toBe(true);
            }
        }
    });

    it('MOBILE-02: Android Back from a tab returns to Home (Android only)', async function () {
        if (!driver.isAndroid) this.skip(); // iOS has no system Back button
        await FormsPage.open();

        await driver.back();

        await expect(TabBar.screen('Home')).toBeDisplayed();
        expect(await driver.queryAppState(appId())).toBe(RUNNING_IN_FOREGROUND);
    });

    it('MOBILE-03: Android Back closes the keyboard and stays on the screen (Android only)', async function () {
        if (!driver.isAndroid) this.skip(); // iOS has no system Back button
        await FormsPage.open();
        await FormsPage.textInput.click();
        await driver.waitUntil(() => driver.isKeyboardShown(), { timeoutMsg: 'The keyboard did not open.' });

        await driver.back();

        await driver.waitUntil(async () => !(await driver.isKeyboardShown()), {
            timeoutMsg: 'Back did not close the keyboard.',
        });
        await expect(FormsPage.screen).toBeDisplayed();
    });

    it('MOBILE-04: resumes on the same screen after going to the background', async () => {
        await FormsPage.open();
        await FormsPage.typeText(formsInput.textBeforeNavigation);

        // Sends the app to the background for 3 seconds, then brings it back (a resume, not a restart).
        await driver.background(3);

        await FormsPage.screen.waitForDisplayed({ timeoutMsg: 'The Forms screen was not shown after resuming.' });
        expect(await driver.queryAppState(appId())).toBe(RUNNING_IN_FOREGROUND);
        await expect(FormsPage.typedTextResult).toHaveText(formsInput.textBeforeNavigation);
    });
});

import { env } from '../../config/env';
import TabBar from '../../pageobjects/TabBar';
import { appId } from '../../utils/app';
import { deviceInfo } from '../../utils/platform';

// Appium's app states: 4 means "running in the foreground".
const RUNNING_IN_FOREGROUND = 4;

describe('Framework verification', () => {
    it('starts an Appium session on the selected platform and launches the app', async () => {
        const info = deviceInfo();
        console.log('Device and platform:', JSON.stringify(info, null, 2));

        expect(info.platform.toLowerCase()).toBe(env.platform);

        await TabBar.waitForTabBarShown();
        expect(await driver.queryAppState(appId())).toBe(RUNNING_IN_FOREGROUND);
    });
});

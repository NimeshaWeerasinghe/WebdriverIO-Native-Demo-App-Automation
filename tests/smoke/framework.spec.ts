import allure from '@wdio/allure-reporter';
import { env } from '../../config/env';
import TabBar from '../../pageobjects/TabBar';
import { appId, RUNNING_IN_FOREGROUND } from '../../utils/app';
import { deviceInfo } from '../../utils/platform';

describe('Framework verification', () => {
    it('SMOKE-01: starts an Appium session on the selected platform and launches the app', async () => {
        // The device details are also printed once per run by the "before" hook in wdio.conf.ts.
        const info = deviceInfo();
        allure.addAttachment('Device and platform', JSON.stringify(info, null, 2), 'application/json');

        expect(info.platform.toLowerCase()).toBe(env.platform);

        await TabBar.waitForTabBarShown();
        expect(await driver.queryAppState(appId())).toBe(RUNNING_IN_FOREGROUND);
    });
});

/**
 * A locator is either one selector that works on both platforms (usually an accessibility id like `~input-email`),
 * or a pair with a separate selector for Android and iOS.
 */
export type Locator = string | { android: string; ios: string };

/** Returns the selector for the platform of the current session. */
export function forPlatform(locator: Locator): string {
    if (typeof locator === 'string') return locator;
    return driver.isIOS ? locator.ios : locator.android;
}

/** Device and session details reported by Appium for the current session. */
export function deviceInfo() {
    const caps = driver.capabilities as Record<string, unknown>;
    const pick = (...keys: string[]) => keys.map((key) => caps[key]).find((value) => value !== undefined);
    return {
        platform: driver.isIOS ? 'iOS' : driver.isAndroid ? 'Android' : 'unknown',
        platformVersion: pick('platformVersion', 'appium:platformVersion'),
        deviceName: pick('deviceName', 'appium:deviceName'),
        deviceModel: pick('deviceModel', 'appium:deviceModel'),
        udid: pick('deviceUDID', 'udid', 'appium:udid'),
        automationName: pick('automationName', 'appium:automationName'),
        sessionId: driver.sessionId,
    };
}

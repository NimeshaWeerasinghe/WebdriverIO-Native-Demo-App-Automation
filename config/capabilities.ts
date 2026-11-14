import { env } from './env';

/**
 * Appium capabilities for each platform. All device-specific values come from `env`,
 * so nothing here is tied to one machine or one device.
 */

const NEW_COMMAND_TIMEOUT_SECONDS = 240;

function androidCapabilities(): WebdriverIO.Capabilities {
    const android = env.android!;
    return {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': android.deviceName,
        'appium:udid': android.udid,
        'appium:platformVersion': android.platformVersion,
        'appium:app': android.appPath,
        'appium:appPackage': android.appPackage,
        'appium:appActivity': android.appActivity,
        'appium:autoGrantPermissions': true,
        'appium:newCommandTimeout': NEW_COMMAND_TIMEOUT_SECONDS,
        // The app is launched once at session start and only closed when the session ends.
        'appium:shouldTerminateApp': true,
    };
}

function iosCapabilities(): WebdriverIO.Capabilities {
    const ios = env.ios!;
    return {
        platformName: 'iOS',
        'appium:automationName': 'XCUITest',
        'appium:deviceName': ios.deviceName,
        'appium:udid': ios.udid,
        'appium:platformVersion': ios.platformVersion,
        // Install from a signed build if given, otherwise launch the already installed app.
        ...(ios.appPath ? { 'appium:app': ios.appPath } : { 'appium:bundleId': ios.bundleId }),
        'appium:newCommandTimeout': NEW_COMMAND_TIMEOUT_SECONDS,
        // The app is launched once at session start and only closed when the session ends.
        'appium:shouldTerminateApp': true,
        // Building WebDriverAgent the first time can take several minutes.
        'appium:wdaLaunchTimeout': 300000,
        'appium:showXcodeLog': true,
        // Simulators need no signing; real devices need WebDriverAgent signing (see README, "iOS real-device setup").
        ...(ios.simulator
            ? {
                  'appium:isHeadless': ios.headless,
                  'appium:simulatorStartupTimeout': 300000,
              }
            : {
                  'appium:xcodeOrgId': ios.xcodeOrgId,
                  'appium:xcodeSigningId': ios.xcodeSigningId,
                  'appium:updatedWDABundleId': ios.updatedWdaBundleId,
              }),
    };
}

/** Removes unset values so Appium only receives capabilities that were actually configured. */
function withoutEmptyValues(capabilities: WebdriverIO.Capabilities): WebdriverIO.Capabilities {
    return Object.fromEntries(
        Object.entries(capabilities).filter(([, value]) => value !== undefined),
    ) as WebdriverIO.Capabilities;
}

export function capabilitiesForPlatform(): WebdriverIO.Capabilities {
    const capabilities = env.platform === 'ios' ? iosCapabilities() : androidCapabilities();
    return withoutEmptyValues(capabilities);
}

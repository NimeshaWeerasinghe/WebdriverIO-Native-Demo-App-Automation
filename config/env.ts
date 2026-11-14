import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Reads and validates all environment variables in one place, so a missing or wrong value
 * stops the run before any device is touched, with a message that says how to fix it.
 * Values come from the shell or from a local `.env` file (see `.env.example`).
 */

export type Platform = 'android' | 'ios';

const DEFAULT_ANDROID_APP = 'apps/android/android.wdio.native.app.v2.2.0.apk';
const DEFAULT_IOS_BUNDLE_ID = 'org.reactjs.native.example.wdiodemoapp';

function read(name: string): string | undefined {
    const value = process.env[name]?.trim();
    return value ? value : undefined;
}

function fail(message: string): never {
    throw new Error(`Configuration error: ${message}\nSee .env.example and the README for the available settings.`);
}

function readPlatform(): Platform {
    const value = (read('PLATFORM') ?? 'android').toLowerCase();
    if (value !== 'android' && value !== 'ios') {
        fail(`PLATFORM must be "android" or "ios", but it is "${value}".`);
    }
    return value;
}

/** Resolves a path relative to the project folder and checks that the file exists. */
function existingFile(variable: string, filePath: string, hint: string): string {
    const absolute = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(absolute)) {
        fail(`${variable} points to "${filePath}", but no file exists there. ${hint}`);
    }
    return absolute;
}

/** Optional external Appium server. When it is not set, the tests start their own local Appium server. */
function readAppiumServer() {
    const url = read('APPIUM_SERVER_URL');
    if (!url) return undefined;
    try {
        const parsed = new URL(url);
        return {
            protocol: parsed.protocol.replace(':', ''),
            hostname: parsed.hostname,
            port: Number(parsed.port || 4723),
            path: parsed.pathname || '/',
        };
    } catch {
        return fail(`APPIUM_SERVER_URL "${url}" is not a valid URL, e.g. http://127.0.0.1:4723`);
    }
}

function readAndroid() {
    return {
        deviceName: read('ANDROID_DEVICE_NAME') ?? 'Android Device',
        // Optional when only one device is connected; required to pick one when several are.
        udid: read('ANDROID_UDID'),
        platformVersion: read('ANDROID_PLATFORM_VERSION'),
        appPath: existingFile(
            'ANDROID_APP_PATH',
            read('ANDROID_APP_PATH') ?? DEFAULT_ANDROID_APP,
            'Run "npm run download:app" or set ANDROID_APP_PATH to the APK.',
        ),
        appPackage: 'com.wdiodemoapp',
        appActivity: '.MainActivity',
    };
}

function readIos() {
    const udid = read('IOS_UDID');
    if (!udid) {
        fail('IOS_UDID is required for an iOS real device. Find it with "xcrun xctrace list devices".');
    }
    const appPathValue = read('IOS_APP_PATH');
    const bundleIdValue = read('IOS_BUNDLE_ID');
    if (!appPathValue && !bundleIdValue) {
        fail('Set IOS_APP_PATH to a signed .ipa/.app, or IOS_BUNDLE_ID if the app is already installed on the device.');
    }
    return {
        deviceName: read('IOS_DEVICE_NAME') ?? 'iPhone',
        udid,
        platformVersion: read('IOS_PLATFORM_VERSION'),
        appPath: appPathValue
            ? existingFile('IOS_APP_PATH', appPathValue, 'It must be a signed device build (.ipa or .app).')
            : undefined,
        bundleId: bundleIdValue ?? DEFAULT_IOS_BUNDLE_ID,
        // Code signing for WebDriverAgent on a real iPhone.
        xcodeOrgId: read('IOS_XCODE_ORG_ID'),
        xcodeSigningId: read('IOS_XCODE_SIGNING_ID') ?? 'Apple Development',
        updatedWdaBundleId: read('IOS_WDA_BUNDLE_ID'),
    };
}

const platform = readPlatform();

export const env = {
    platform,
    appiumServer: readAppiumServer(),
    // Only the selected platform is validated, so Android runs need no iOS settings and vice versa.
    android: platform === 'android' ? readAndroid() : undefined,
    ios: platform === 'ios' ? readIos() : undefined,
};

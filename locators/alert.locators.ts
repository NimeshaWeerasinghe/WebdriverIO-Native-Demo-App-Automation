import type { Locator } from '../utils/platform';

/** Native alert dialog. These differ per platform because they are OS dialogs, not app views. */
export const AlertLocators = {
    // On Android, React Native renders the title in its own view, so it has the app's id, not android:id/alertTitle.
    title: {
        android: 'id=com.wdiodemoapp:id/alert_title',
        ios: '-ios class chain:**/XCUIElementTypeAlert/**/XCUIElementTypeStaticText[1]',
    },
    message: {
        android: 'id=android:id/message',
        ios: '-ios class chain:**/XCUIElementTypeAlert/**/XCUIElementTypeStaticText[2]',
    },
    okButton: {
        android: 'id=android:id/button1',
        ios: '~OK',
    },
} satisfies Record<string, Locator>;

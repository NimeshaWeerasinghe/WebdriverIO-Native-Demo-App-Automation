import type { Locator } from '../utils/platform';

/** Bottom tab bar. The app sets the same accessibility ids on Android and iOS. */
export const TabBarLocators = {
    homeTab: '~Home',
    loginTab: '~Login',
    formsTab: '~Forms',
} satisfies Record<string, Locator>;

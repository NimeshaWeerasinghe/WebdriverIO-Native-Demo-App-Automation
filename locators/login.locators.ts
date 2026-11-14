import type { Locator } from '../utils/platform';

/** Login tab (Login and Sign up modes). Accessibility ids are shared by both platforms. */
export const LoginLocators = {
    screen: '~Login-screen',
    loginModeButton: '~button-login-container',
    signUpModeButton: '~button-sign-up-container',
    emailInput: '~input-email',
    passwordInput: '~input-password',
    repeatPasswordInput: '~input-repeat-password',
    loginButton: '~button-LOGIN',
    signUpButton: '~button-SIGN UP',

    /** Validation messages have no accessibility id, so they are found by their visible text. */
    errorMessage: (text: string): Locator => ({
        android: `android=new UiSelector().text("${text}")`,
        ios: `-ios predicate string:label == "${text}"`,
    }),
};

/**
 * Test data and the texts the app is expected to show. Kept apart from the tests,
 * so changing an input or an expected message happens in one place.
 * The app has no backend, so these are made up values, not real credentials.
 */
export const users = {
    valid: { email: 'test.user@example.com', password: 'Password123' },
    newUser: { email: 'new.user@example.com', password: 'Password123' },
};

export const invalidInput = {
    email: 'not-an-email',
    shortPassword: 'Pass123', // 7 characters, the minimum is 8
    otherPassword: 'Password456',
};

export const messages = {
    loginSuccess: { title: 'Success', message: 'You are logged in!' },
    signUpSuccess: { title: 'Signed Up!', message: 'You successfully signed up!' },
    activeButton: { title: 'This button is', message: 'This button is active' },
    invalidEmail: 'Please enter a valid email address',
    shortPassword: 'Please enter at least 8 characters',
    passwordsDoNotMatch: 'Please enter the same password',
    switchOff: 'Click to turn the switch ON',
    switchOn: 'Click to turn the switch OFF',
};

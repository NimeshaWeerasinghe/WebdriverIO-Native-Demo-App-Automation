import type { Locator } from '../utils/platform';

/** Forms tab. Accessibility ids are shared by both platforms. */
export const FormsLocators = {
    screen: '~Forms-screen',
    textInput: '~text-input',
    typedTextResult: '~input-text-result',
    switchToggle: '~switch',
    switchLabel: '~switch-text',
    activeButton: '~button-Active',
} satisfies Record<string, Locator>;

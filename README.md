# WebdriverIO Native Demo App – UI tests

Automated UI tests for the [WebdriverIO Native Demo App v2.2.0](https://github.com/webdriverio/native-demo-app/releases/tag/v2.2.0).
They run on **Android** (required) and also on an **iOS simulator**, using the same tests for both.

There are 26 tests: the 9 required scenarios (sign up, login, forms), a setup check, and 16 extra tests (see the end of this file).

---

## How to set up and run the tests

### 1. What you need

- **Node.js 20** or newer
- **Java 17** or newer (`JAVA_HOME` set)
- **Android Studio**, with an emulator, or an Android phone with USB debugging on
- `adb` on your `PATH` (it comes with Android Studio, in `platform-tools`)

Appium and its drivers are installed by `npm install`. You don't need a global Appium.

### 2. Install

```bash
npm install
```

```bash
npm run download:app
```

The second command downloads the Android app (`.apk`) into `apps/android/`.

### 3. Start a device

Start an Android emulator from Android Studio, or plug in a phone. Check that it's listed:

```bash
adb devices
```

If you use a real phone, keep it unlocked while the tests run (Developer options → **Stay awake** helps).

### 4. Run the tests

```bash
npm run test:android
```

Other useful commands:

| Command | What it does |
| --- | --- |
| `npm run test:android:smoke` | Only checks that Appium starts and the app opens |
| `npm run test:android -- --suite login` | Runs one area: `signup`, `login`, `forms` or `mobile` |
| `npm run report` | Opens the Allure report of the last run |

If more than one device is connected, choose one: `ANDROID_UDID=emulator-5554 npm run test:android`.
All settings are listed in `.env.example` (copy it to `.env` to use them).

### iOS (optional)

The tests also run on an iOS simulator, using the simulator build from the release:

```bash
npm run download:app:ios
```

```bash
PLATFORM=ios IOS_SIMULATOR=true IOS_UDID=<simulator id> IOS_APP_PATH=apps/ios/ios.simulator.wdio.native.app.v2.2.0.zip npm run test:ios
```

This needs a Mac with Xcode. In the simulator, turn off **Settings → General → AutoFill & Passwords**. Otherwise iOS fills the sign-up password fields with its own password and the tests can't type.

---

## Which tool I chose and why

**Appium + WebdriverIO + TypeScript**, with Mocha as the test runner.

- **I already use this stack at work.** I use Appium, WebdriverIO and TypeScript on my current company's mobile projects, so I could focus on good test design rather than learning a new tool.
- **Appium** is the standard open-source tool for native mobile apps. The same tests work on Android and iOS.
- **The app was built for it.** The demo app is made by the WebdriverIO team for practising Appium, and most elements have accessibility ids, which are the most stable locators.
- **WebdriverIO waits for you.** Commands like `waitForDisplayed` and `expect(...).toHaveText(...)` keep retrying until the condition is met, so the tests never need fixed sleeps.
- **TypeScript** catches mistakes (like a wrong method name) before the tests run.

I considered Maestro, which is faster to start with, but Appium gives more control over waits and structure, and it's what most teams use for larger suites.

---

## How the project is organised

```
pageobjects/     One file per screen: its locators and actions
  LoginPage.ts     Login and Sign up form
  FormsPage.ts     Forms tab (input, switch, dropdown, buttons)
  NativeAlert.ts   The native pop-up dialogs
  TabBar.ts        The bottom tab bar
tests/           The tests, one folder per area
  smoke/  signup/  login/  forms/  mobile/
  data/testData.ts Test inputs and the texts the app should show
utils/           Shared helpers (keyboard, pop-ups, reporting)
config/          Settings and Appium capabilities for Android and iOS
wdio.conf.ts     WebdriverIO configuration
```

How it works:

- **Page objects:** each screen has one class with its locators and actions, like `LoginPage.signUp(email, password, repeat)`. The tests only describe the steps and what they expect, so they read like the scenario.
- **Stable locators:** elements are found by accessibility id (for example `~input-email`). Where Android and iOS differ, the page object holds both.
- **No fixed sleeps:** every step waits for something visible to happen.
- **One app session:** the app is opened once and stays open for the whole run, like a real user moving between screens. Each test first navigates to the screen it needs, so tests don't depend on each other.
- **Failure details:** when a test fails, the Allure report gets a screenshot, the screen's layout and the error.

---

## What I would do next with more time

- **Run the tests in CI on every push.** Android would run on an emulator in GitHub Actions, and the Allure report would be saved with each run. Today GitHub Actions only runs the iOS simulator job and a type check.
- **Run on more devices in parallel.** For example, on a device cloud such as BrowserStack, to cover different Android versions and screen sizes. Each device would get its own session.
- **Cover the remaining screens:** the Swipe and Drag interactions, the WebView tab and the "Inactive" button.
- **Add lint and formatting checks** (ESLint and Prettier), so the code style stays consistent as the suite grows.
- **Test on a real iPhone.** The release only has a simulator build, so this needs a signed build of the app.

---

## Extra tests and bugs found

Besides the required scenarios, I added tests for: empty fields, an email without a domain, a password of exactly 7 and 8 characters, the 30-character limit of the Forms input, special characters, clearing the input, the dropdown, leaving a screen and coming back, switching tabs, the Android Back button, and sending the app to the background.

Two bugs found:

1. **Sign up rejects an email with spaces around it.** `  new.user@example.com  ` shows "Please enter a valid email address" instead of ignoring the spaces.
2. **Sign up shows "Please enter the same password" when both passwords match.** It happens when the password is too short (7 characters) or the fields are empty.

---

## Use of AI tools

I used **Claude (Anthropic's AI assistant, via Claude Code)** throughout this project. I treated it as a pair-programmer that I directed: I set the direction and the rules at each stage, Claude did most of the hands-on work, and I checked the result before moving on. This is how the work was split.

**1. Choosing the framework**
I chose Appium + WebdriverIO + TypeScript, the stack I already use at work. Claude checked what was already installed on my machine (Node, Java, Android SDK, Appium) and set the project up with compatible versions. For example, it found that WebdriverIO 10 only works with Appium 3, so WebdriverIO 9 was used for Appium 2.

**2. Designing the architecture**
I wrote down how the project should be built: the folder layout, page objects with their locators inside them, one shared test implementation for Android and iOS, configuration through environment variables, Allure reporting, explicit waits only, and one app session for the whole run without restarts. Claude implemented that structure step by step. I adjusted it along the way: I removed a separate `locators/` folder and a `BasePage` class to keep the code simple, and I asked for an audit against best practices before any changes were applied.

**3. Designing the tests**
The required scenarios come from the assignment. For those, I decided what each test should check. I designed the extra scenarios myself (boundary values, empty and malformed input, navigation, keyboard, Back button, background and resume). Claude first checked how the app actually behaves for each idea, so no test expects something the app doesn't do. That's how the 30-character limit and the two bugs were found, and why the wrong-password test was left out. Claude also generated the test data for these cases, such as the 7- and 8-character passwords and the malformed emails.

**4. Writing, running and fixing**
Claude wrote the code to these decisions and ran the tests on an Android emulator, my Samsung phone and an iOS simulator. When tests failed, it collected the evidence (screenshots and screen layouts from the Allure report) and proposed fixes. I decided which fixes to accept, for example how to handle the Samsung Pass pop-ups and the iOS "Automatic Strong Password" behaviour.

**5. Reviewing**
I reviewed the code and the test results at each step and watched how the suite behaved on the devices. Nothing was pushed until I had reviewed it.

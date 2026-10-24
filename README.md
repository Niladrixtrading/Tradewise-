# TradeWise — Free Trading Education

A starter app built with Expo / React Native for Android and web. The app is designed to teach market concepts from beginner to advanced, at no cost.

## Included
- Free learning lessons covering foundations, stocks, funds and indices, forex, crypto, commodities, derivatives/options, technical and fundamental analysis, risk management, and trading psychology.
- Searchable course library, lesson completion, and bookmarks.
- Knowledge quiz with explanations and score tracking.
- Virtual trading simulator with fictional prices and virtual cash only.
- Local progress storage using AsyncStorage.
- No broker connection, no real-money trading, no subscriptions, no live price feed.

## Requirements
- Node.js LTS
- npm
- For Android builds, an Expo account and EAS CLI are recommended.
- Android Studio is optional for local Android emulation.

## Install and run
```bash
npm install
npx expo start
```
Use the Expo Go app to scan the QR code for local testing on an Android phone.

Run in a web browser:
```bash
npx expo start --web
```

## Create an Android production build
1. Create an Expo account at https://expo.dev/
2. Install the EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
3. Log in:
   ```bash
   eas login
   ```
4. Configure the project:
   ```bash
   eas build:configure
   ```
5. Build an Android App Bundle for Play Console:
   ```bash
   eas build --platform android --profile production
   ```
6. Download the generated `.aab` file from the build page.
7. In Google Play Console, create your app listing, upload the AAB to a testing track, complete the required declarations, and test before production release.

## Before publishing
- Replace the Android package name `com.tradewise.learnfree` with a package name you control before the first release, if necessary.
- Create a proper app icon and screenshots.
- Add a privacy policy and a support contact. Explain that learning progress is stored locally and whether any data is collected.
- Complete Google Play Data safety, content rating, target audience, financial features, and other required declarations accurately.
- Check current Google Play target API and testing requirements in Play Console; these can change.
- Test on multiple screen sizes and Android versions.
- Consider getting a qualified review of financial education content. This app is educational, not investment advice.
- Never advertise guaranteed profits or add real trading/broker features without separately reviewing legal and policy requirements.

## Important limitations
The simulator uses fixed, fictional sample prices and is not a live market simulator. The starter has no login, cloud sync, notifications, backend, or market-data API. Progress is stored on the user's device.

## Build an installable Android APK

This project is configured with an EAS `preview` profile that outputs an APK. On a computer with Node.js installed:

1. Extract this ZIP and open a terminal in the `TradeWise_Learning_App` folder.
2. Run `npm install`.
3. Run `npx eas-cli login` and sign in to an Expo account (account owner/parent should do this).
4. Run `npx eas-cli build --platform android --profile preview`.
5. When the cloud build finishes, open the build link EAS provides and download the `.apk` file to your Android phone.

The APK is not included in this ZIP; the EAS cloud build still needs to be run by someone signed in to an Expo account.

## Build an installable APK with GitHub Actions

This project includes `.github/workflows/build-apk.yml` to build a debug APK in GitHub's cloud runner.

1. Upload the contents of this project to a GitHub repository (the folder `TradeWise_Learning_App` should be the repository root; its `.github` folder must be included).
2. Open the repository's **Actions** tab and select **Build TradeWise Android APK**.
3. Press **Run workflow** (or push to the `main` branch).
4. When the run succeeds, open that run and download the **TradeWise-Android-APK** artifact.
5. Extract the downloaded artifact and install `app-debug.apk` on your Android phone. If Android blocks the install, allow installation for the browser/file manager you used, and only install APKs from your own trusted build.

The APK is not included in this ZIP; GitHub must successfully run the workflow first. This workflow creates a debug APK for personal testing, not a Play Store release build.

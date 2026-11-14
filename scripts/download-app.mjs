// Downloads the prebuilt app (v2.2.0) from the official GitHub release.
//   node scripts/download-app.mjs          -> Android APK into ./apps/android
//   node scripts/download-app.mjs ios      -> iOS simulator build (.zip) into ./apps/ios
import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const VERSION = 'v2.2.0';
const platform = process.argv[2] ?? 'android';
const FILES = {
  android: `android.wdio.native.app.${VERSION}.apk`,
  ios: `ios.simulator.wdio.native.app.${VERSION}.zip`,
};

const file = FILES[platform];
if (!file) throw new Error(`Unknown platform "${platform}", use "android" or "ios".`);

const url = `https://github.com/webdriverio/native-demo-app/releases/download/${VERSION}/${file}`;
const folder = `apps/${platform}`;
const target = `${folder}/${file}`;

if (existsSync(target)) {
  console.log(`${target} already exists, skipping download.`);
} else {
  mkdirSync(folder, { recursive: true });
  console.log(`Downloading ${url} ...`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: HTTP ${response.status}`);
  await pipeline(Readable.fromWeb(response.body), createWriteStream(target));
  console.log(`Saved to ${target}`);
}

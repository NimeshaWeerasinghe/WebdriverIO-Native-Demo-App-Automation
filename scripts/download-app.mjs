// Downloads the prebuilt Android app (v2.2.0) from the official GitHub release into ./apps.
import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const VERSION = 'v2.2.0';
const FILE = `android.wdio.native.app.${VERSION}.apk`;
const URL = `https://github.com/webdriverio/native-demo-app/releases/download/${VERSION}/${FILE}`;
const target = `apps/${FILE}`;

if (existsSync(target)) {
  console.log(`${target} already exists, skipping download.`);
} else {
  mkdirSync('apps', { recursive: true });
  console.log(`Downloading ${URL} ...`);
  const response = await fetch(URL);
  if (!response.ok) throw new Error(`Download failed: HTTP ${response.status}`);
  await pipeline(Readable.fromWeb(response.body), createWriteStream(target));
  console.log(`Saved to ${target}`);
}

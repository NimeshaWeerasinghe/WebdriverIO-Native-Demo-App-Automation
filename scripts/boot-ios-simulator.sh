#!/usr/bin/env bash
# Boots the newest available iPhone simulator and prints its UDID (used by the iOS CI job).
# Usage: UDID=$(scripts/boot-ios-simulator.sh)
set -euo pipefail

UDID=$(xcrun simctl list devices available --json | node -e '
  const { devices } = JSON.parse(require("fs").readFileSync(0, "utf8"));
  // Runtime keys look like "com.apple.CoreSimulator.SimRuntime.iOS-18-2"; pick the newest iOS one.
  const iosRuntimes = Object.keys(devices)
    .filter((runtime) => runtime.includes(".iOS-"))
    .sort((a, b) => {
      const version = (r) => r.split(".iOS-")[1].split("-").map(Number);
      const [va, vb] = [version(a), version(b)];
      return vb[0] - va[0] || (vb[1] ?? 0) - (va[1] ?? 0);
    });
  for (const runtime of iosRuntimes) {
    const iphone = devices[runtime].find((device) => device.name.startsWith("iPhone"));
    if (iphone) { console.error(`Using ${iphone.name} (${runtime})`); console.log(iphone.udid); process.exit(0); }
  }
  console.error("No available iPhone simulator found."); process.exit(1);
')

xcrun simctl boot "$UDID" 2>/dev/null || true # already booted is fine
xcrun simctl bootstatus "$UDID" -b >&2
echo "$UDID"

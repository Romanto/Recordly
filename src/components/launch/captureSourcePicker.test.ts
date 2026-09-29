import { describe, expect, it } from "vitest";

import { canChooseCaptureSource } from "./captureSourcePicker";

describe("canChooseCaptureSource", () => {
	it("waits until the platform is known", () => {
		expect(canChooseCaptureSource(null, null)).toBe(false);
	});

	it("shows the picker on macOS and Windows", () => {
		expect(canChooseCaptureSource("darwin", null)).toBe(true);
		expect(canChooseCaptureSource("win32", null)).toBe(true);
	});

	it("shows the picker on Linux X11 and hides it on Wayland", () => {
		expect(canChooseCaptureSource("linux", "x11")).toBe(true);
		expect(canChooseCaptureSource("linux", "wayland")).toBe(false);
		expect(canChooseCaptureSource("linux", null)).toBe(false);
	});
});

import { describe, expect, it } from "vitest";

import {
	getLinuxWindowSystem,
	getScreenSourceIdForDisplay,
	LINUX_PORTAL_SCREEN_SOURCE_ID,
	shouldUseLinuxPortalSyntheticSource,
} from "./sourceMapping";

describe("getScreenSourceIdForDisplay", () => {
	it("keeps the live Electron screen source when one is available", () => {
		expect(
			getScreenSourceIdForDisplay({
				displayId: "42",
				matchedSourceId: "screen:42:0",
				platform: "linux",
			}),
		).toBe("screen:42:0");
	});

	it("routes unmatched Linux Wayland screens through the portal sentinel", () => {
		expect(
			getScreenSourceIdForDisplay({
				displayId: "42",
				env: { XDG_SESSION_TYPE: "wayland", WAYLAND_DISPLAY: "wayland-0" },
				matchedSourceId: null,
				platform: "linux",
			}),
		).toBe(LINUX_PORTAL_SCREEN_SOURCE_ID);
	});

	it("keeps unmatched Linux X11 screens on the explicit fallback id", () => {
		expect(
			getScreenSourceIdForDisplay({
				displayId: "42",
				env: { XDG_SESSION_TYPE: "x11", DISPLAY: ":0" },
				matchedSourceId: null,
				platform: "linux",
			}),
		).toBe("screen:fallback:42");
	});

	it("keeps non-Linux unmatched screens on the explicit fallback id", () => {
		expect(
			getScreenSourceIdForDisplay({
				displayId: "42",
				matchedSourceId: undefined,
				platform: "win32",
			}),
		).toBe("screen:fallback:42");
	});
});

describe("shouldUseLinuxPortalSyntheticSource", () => {
	it("uses the synthetic portal source only on Wayland when unset or sentinel", () => {
		expect(
			shouldUseLinuxPortalSyntheticSource({
				platform: "linux",
				env: { XDG_SESSION_TYPE: "wayland" },
				sourceId: null,
			}),
		).toBe(true);
		expect(
			shouldUseLinuxPortalSyntheticSource({
				platform: "linux",
				env: { XDG_SESSION_TYPE: "wayland" },
				sourceId: LINUX_PORTAL_SCREEN_SOURCE_ID,
			}),
		).toBe(true);
	});

	it("does not use the synthetic portal source on X11", () => {
		expect(
			shouldUseLinuxPortalSyntheticSource({
				platform: "linux",
				env: { XDG_SESSION_TYPE: "x11" },
				sourceId: null,
			}),
		).toBe(false);
		expect(
			shouldUseLinuxPortalSyntheticSource({
				platform: "linux",
				env: { XDG_SESSION_TYPE: "x11" },
				sourceId: LINUX_PORTAL_SCREEN_SOURCE_ID,
			}),
		).toBe(false);
	});
});

describe("getLinuxWindowSystem", () => {
	it("reports wayland or x11 on Linux and null elsewhere", () => {
		if (process.platform === "linux") {
			expect(getLinuxWindowSystem({ XDG_SESSION_TYPE: "wayland" })).toBe("wayland");
			expect(getLinuxWindowSystem({ XDG_SESSION_TYPE: "x11" })).toBe("x11");
		} else {
			expect(getLinuxWindowSystem({ XDG_SESSION_TYPE: "wayland" })).toBe(null);
		}
	});
});

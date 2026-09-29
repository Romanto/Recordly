import { describe, expect, it } from "vitest";

import { getGpuSwitches } from "./gpuSwitches";

describe("getGpuSwitches", () => {
	it("returns the Linux VAAPI workaround without forcing a GL backend", () => {
		expect(getGpuSwitches("linux")).toEqual({
			disableFeatures: ["VaapiVideoDecoder", "VaapiVideoEncoder"],
		});
	});

	it("keeps the macOS and Windows ANGLE backends", () => {
		expect(getGpuSwitches("darwin")).toEqual({
			useAngle: "metal",
			disableFeatures: ["MacCatapLoopbackAudioForScreenShare"],
		});
		expect(getGpuSwitches("win32")).toEqual({ useAngle: "d3d11" });
	});
});

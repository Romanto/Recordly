export interface GpuSwitches {
	useAngle?: string;
	useGl?: string;
	disableFeatures?: string[];
}

export function getGpuSwitches(platform: NodeJS.Platform): GpuSwitches {
	if (platform === "darwin") {
		return {
			useAngle: "metal",
			disableFeatures: ["MacCatapLoopbackAudioForScreenShare"],
		};
	}

	if (platform === "win32") {
		return { useAngle: "d3d11" };
	}

	if (platform === "linux") {
		// Electron 43 maps --use-gl=egl to the removed GLES2 backend. The GPU
		// process then exits because the only allowed implementation is ANGLE
		// (gl=egl-angle). Leaving the GL backend unset lets Chromium pick that.
		return {
			disableFeatures: ["VaapiVideoDecoder", "VaapiVideoEncoder"],
		};
	}

	return {};
}

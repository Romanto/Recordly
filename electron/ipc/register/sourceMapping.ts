export const LINUX_PORTAL_SCREEN_SOURCE_ID = "screen:linux-portal";

export function isLikelyLinuxWaylandSession(env: NodeJS.ProcessEnv) {
	const sessionType = env.XDG_SESSION_TYPE?.trim().toLowerCase();
	if (sessionType === "wayland") {
		return true;
	}
	if (sessionType === "x11") {
		return false;
	}

	return Boolean(env.WAYLAND_DISPLAY);
}

export function getLinuxWindowSystem(
	env: NodeJS.ProcessEnv = process.env,
): "wayland" | "x11" | null {
	if (process.platform !== "linux") {
		return null;
	}

	return isLikelyLinuxWaylandSession(env) ? "wayland" : "x11";
}

/**
 * On Wayland, returning a synthetic source avoids a double portal prompt.
 * On X11 that synthetic id is not a real capturer and fails with
 * "Could not start video source", so fall through to desktopCapturer.
 */
export function shouldUseLinuxPortalSyntheticSource({
	platform,
	env = process.env,
	sourceId,
}: {
	platform: NodeJS.Platform | string;
	env?: NodeJS.ProcessEnv;
	sourceId: string | null | undefined;
}) {
	if (platform !== "linux" || !isLikelyLinuxWaylandSession(env)) {
		return false;
	}

	return sourceId === LINUX_PORTAL_SCREEN_SOURCE_ID || !sourceId;
}

export function getScreenSourceIdForDisplay({
	displayId,
	env = process.env,
	matchedSourceId,
	platform,
}: {
	displayId: string;
	env?: NodeJS.ProcessEnv;
	matchedSourceId?: string | null;
	platform: NodeJS.Platform | string;
}) {
	if (matchedSourceId) {
		return matchedSourceId;
	}

	if (platform === "linux" && isLikelyLinuxWaylandSession(env)) {
		return LINUX_PORTAL_SCREEN_SOURCE_ID;
	}

	return `screen:fallback:${displayId}`;
}

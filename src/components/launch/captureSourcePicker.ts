export function canChooseCaptureSource(
	platform: string | null,
	linuxWindowSystem: "wayland" | "x11" | null,
): boolean {
	if (!platform) {
		return false;
	}

	if (platform !== "linux") {
		return true;
	}

	// Wayland capture goes through the desktop portal, which picks the screen
	// itself. X11 can list real displays and record the one the user selects.
	return linuxWindowSystem === "x11";
}

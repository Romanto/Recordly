import { useEffect, useState } from "react";

export function useLaunchWindowSystemState(
	preparePermissions: (args: { startup?: boolean }) => Promise<unknown>,
) {
	const [hudOverlayMousePassthroughSupported, setHudOverlayMousePassthroughSupported] = useState<
		boolean | null
	>(null);
	const [platform, setPlatform] = useState<string | null>(null);
	const [linuxWindowSystem, setLinuxWindowSystem] = useState<"wayland" | "x11" | null>(null);

	useEffect(() => {
		window.electronAPI?.hudOverlayRendererReady?.();
	}, []);

	useEffect(() => {
		let cancelled = false;
		const loadPlatform = async () => {
			try {
				const nextPlatform = await window.electronAPI.getPlatform();
				if (!cancelled) setPlatform(nextPlatform);
			} catch (error) {
				console.error("Failed to load platform:", error);
			}
		};
		void loadPlatform();
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		if (platform !== "linux") {
			setLinuxWindowSystem(null);
			return;
		}

		let cancelled = false;
		const loadLinuxWindowSystem = async () => {
			try {
				const nextWindowSystem = await window.electronAPI.getLinuxWindowSystem();
				if (!cancelled) setLinuxWindowSystem(nextWindowSystem);
			} catch (error) {
				console.error("Failed to load Linux window system:", error);
			}
		};
		void loadLinuxWindowSystem();
		return () => {
			cancelled = true;
		};
	}, [platform]);

	useEffect(() => {
		let cancelled = false;
		const loadSupport = async () => {
			try {
				const result = await window.electronAPI.getHudOverlayMousePassthroughSupported();
				if (!cancelled && result.success) {
					setHudOverlayMousePassthroughSupported(result.supported);
				}
			} catch (error) {
				console.error("Failed to load HUD overlay mouse passthrough support:", error);
			}
		};
		void loadSupport();
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		void preparePermissions({ startup: true });
	}, [preparePermissions]);

	return { hudOverlayMousePassthroughSupported, platform, linuxWindowSystem };
}

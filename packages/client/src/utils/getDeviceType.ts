export const getDeviceType = (width) => {
	switch (true) {
		case width <= 375:
			return { isMobile: true, isTablet: false, isDesktop: false };
		case width <= 768:
			return { isMobile: false, isTablet: true, isDesktop: false };

		default:
			return { isMobile: false, isTablet: false, isDesktop: true };
	}
};

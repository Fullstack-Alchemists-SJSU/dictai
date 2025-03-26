import {Dimensions} from "react-native"

export enum ScreenSize {
	MEDIUM = "MEDIUM",
	SMALL = "SMALL",
}

const getWindowDimensions = (): ScreenSize => {
	const width = Dimensions.get("window").width
	if (width >= 767) {
		return ScreenSize.MEDIUM
	} else {
		return ScreenSize.SMALL
	}
}

export default getWindowDimensions

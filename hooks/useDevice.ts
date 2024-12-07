import {useEffect, useState} from "react"
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

const useDevice = () => {
	const [dimensions, setDimensions] = useState(getWindowDimensions())

	useEffect(() => {
		const handleResize = () => {
			setDimensions(getWindowDimensions())
		}
	}, [])

	return dimensions
}

export default useDevice

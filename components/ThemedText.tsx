import {header, subtitle} from "@/constants/TextStyle"
import useDevice, {ScreenSize} from "@/hooks/useDevice"
import {Text} from "react-native-paper"

interface IThemedText {
	text: string
	color?: string
	dimension: ScreenSize
}

export const ThemedHeader = ({
	text,
	color = "black",
	dimension,
}: IThemedText) => {
	return (
		<Text
			style={{
				...(dimension == ScreenSize.MEDIUM
					? header.medium
					: header.small),
				color,
			}}>
			{text}
		</Text>
	)
}

export const ThemedSubtitle = ({
	text,
	color = "black",
	dimension,
}: IThemedText) => {
	return (
		<Text
			style={{
				...(dimension == ScreenSize.MEDIUM
					? subtitle.medium
					: subtitle.small),
				color,
			}}>
			{text}
		</Text>
	)
}

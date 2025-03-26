import { header, subtitle } from "@/constants/TextStyle"
import getWindowDimens, { ScreenSize } from "@/utils/getWindowDimens"
import { Text } from "react-native-paper"

interface IThemedText {
	text: string
	color?: string
	dimension: ScreenSize
	variant?: "label" | "subtitle" | "error"
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
	color,
	dimension,
	variant
}: IThemedText) => {
	return (
		<Text
			style={{
				...(variant === "error" ? subtitle.xs :dimension == ScreenSize.MEDIUM
					? subtitle.medium
					: subtitle.small),
				color: `${color ? color : variant === "subtitle" ? "gray" : variant === "error" ? "red" : "black"}`,
			}}>
			{text}
		</Text>
	)
}

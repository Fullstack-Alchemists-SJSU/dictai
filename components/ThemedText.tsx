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

// Local Themed Header for Journal Screen
export const SmallThemedHeader = ({
    text,
    color = "black",
    dimension,
}: {
    text: string;
    color?: string;
    dimension: ScreenSize;
}) => {
    return (
        <Text
            style={{
                fontSize: dimension === ScreenSize.MEDIUM ? 24 : 22, // Smaller font size
                fontWeight: "bold",
                textAlign: "center", // Center alignment
                color,
            }}>
            {text}
        </Text>
    );
};

// Local Themed Subtitle for Journal Screen
export const SmallThemedSubtitle = ({
    text,
    color,
    dimension,
    style,
    numberOfLines,
}: {
    text: string;
    color?: string;
    dimension: ScreenSize;
    style?: any;
    numberOfLines?: number;
}) => {
    return (
        <Text
            style={[
                {
                    fontSize: dimension === ScreenSize.MEDIUM ? 20 : 18,
                    textAlign: "center",
                    color,
                },
                style
            ]}
            numberOfLines={numberOfLines}
        >
            {text}
        </Text>
    );
};
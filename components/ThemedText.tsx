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
}: {
    text: string;
    color?: string;
    dimension: ScreenSize;
}) => {
    return (
        <Text
            style={{
                fontSize: dimension === ScreenSize.MEDIUM ? 20 : 18, // Smaller font size
                textAlign: "center", // Center alignment
				color,
            }}>
            {text}
        </Text>
    );
};


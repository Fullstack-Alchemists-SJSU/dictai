import {GestureResponderEvent} from "react-native"
import {Button, Text} from "react-native-paper"

interface IThemedButton {
	text: string
	mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal"
	onPress?: ((e: GestureResponderEvent) => void) | undefined
	textColor?: string
	textAlign?: "left" | "center" | "right" | "auto" | "justify"
}

const ThemedButton = ({
	text,
	mode = "contained",
	onPress,
	textColor = "white",
	textAlign = "center",
}: IThemedButton) => {
	return (
		<Button
			mode={mode}
			style={{
				margin: 0,
				//marginHorizontal: 8,
				paddingVertical: 8,
				borderRadius: 8,
			}}
			textColor={textColor}
			onPress={onPress}>
			<Text style={{textAlign: textAlign, flex: 1, color: textColor}}>
				{text}
			</Text>
		</Button>
	)
}

export default ThemedButton

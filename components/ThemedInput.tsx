import theme from "@/constants/Theme"
import {InputModeOptions} from "react-native"
import {Text, TextInput} from "react-native-paper"

interface IThemedInput {
	label: string
	value: string
	onChangeText?: (((text: string) => void) & Function) | undefined
	mode?: "flat" | "outlined"
	secured?: boolean
	inputMode?: InputModeOptions
	disabled?: boolean
}

const ThemedInput = ({
	label,
	value,
	onChangeText,
	mode = "outlined",
	inputMode,
	secured = false,
	disabled = false,
}: IThemedInput) => {
	return (
		<TextInput
			inputMode={inputMode}
			label={<Text style={{backgroundColor: "#FFFFFF"}}>{label}</Text>}
			value={value}
			onChangeText={onChangeText}
			secureTextEntry={secured}
			mode={mode}
			style={{margin: 8}}
			disabled={disabled}
		/>
	)
}

export default ThemedInput

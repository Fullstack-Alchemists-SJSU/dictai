import theme from "@/constants/Theme"
import {InputModeOptions, StyleProp, TextStyle} from "react-native"
import {Text, TextInput} from "react-native-paper"
import { forwardRef, useState } from 'react'

interface IThemedInput {
	label?: string
	value: string
	onChangeText?: (((text: string) => void) & Function) | undefined
	mode?: "flat" | "outlined"
	secured?: boolean
	inputMode?: InputModeOptions
	disabled?: boolean
	onSubmitEditing?: () => void
	returnKeyType?: "next" | "done" | "go" | "search" | "send"
}

const ThemedInput = forwardRef<any, IThemedInput>(({
	label,
	value,
	onChangeText,
	mode = "outlined",
	inputMode,
	secured = false,
	disabled = false,
	onSubmitEditing,
	returnKeyType = "next"
}: IThemedInput, ref) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<TextInput
			ref={ref}
			inputMode={inputMode}
			label={label ? <Text style={{backgroundColor: "#FFFFFF"}}>{label}</Text> : undefined}
			value={value}
			onChangeText={onChangeText}
			secureTextEntry={secured && !showPassword}
			mode={mode}
			disabled={disabled}
			returnKeyType={returnKeyType}
			onSubmitEditing={onSubmitEditing}
			right={secured ? (
				<TextInput.Icon
					icon={showPassword ? "eye-off" : "eye"}
					onPress={() => setShowPassword(!showPassword)}
				/>
			) : undefined}
		/>
	)
})

export default ThemedInput

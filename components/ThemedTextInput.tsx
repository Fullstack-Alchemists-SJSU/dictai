import {useThemeColor} from "@/hooks/useThemeColor"
import {useEffect, useState} from "react"
import {
	NativeSyntheticEvent,
	StyleSheet,
	TextInput,
	TextInputChangeEventData,
	TextInputProps,
} from "react-native"

export type ThemedTextInputProps = TextInputProps & {
	lightColor?: string
	darkColor?: string
	type?: "normal" | "medium" | "large"
}

export default function ThemedTextInput({
	style,
	lightColor,
	darkColor,
	type = "normal",
	...rest
}: ThemedTextInputProps) {
	const color = useThemeColor({light: lightColor, dark: darkColor}, "text")
	return (
		<TextInput
			style={[
				{color},
				type === "normal" ? styles.normal : undefined,
				type === "medium" ? styles.medium : undefined,
				type === "large" ? styles.large : undefined,
				style,
			]}
			{...rest}
		/>
	)
}

const styles = StyleSheet.create({
	normal: {
		borderWidth: 1,
		margin: 8,
		padding: 2,
		fontSize: 16,
	},
	medium: {
		borderWidth: 1,
		margin: 16,
		padding: 4,
		fontSize: 32,
	},
	large: {
		borderWidth: 1,
		margin: 32,
		padding: 6,
		fontSize: 48,
	},
})

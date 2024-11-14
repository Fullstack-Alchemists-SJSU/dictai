import {useThemeColor} from "@/hooks/useThemeColor"
import {Button, ButtonProps, Pressable, StyleSheet, Text} from "react-native"

export type ThemedButtonProps = ButtonProps & {
	lightColor?: string
	darkColor?: string
	type?: "normal" | "medium" | "large"
}

export default function ThemedButton({
	title,
	lightColor,
	darkColor,
	type = "normal",
	...rest
}: ThemedButtonProps) {
	const color = useThemeColor({light: lightColor, dark: darkColor}, "text")
	return (
		<Pressable
			color={color}
			{...rest}
			style={
				type === "normal"
					? styles.normal
					: type === "medium"
					? styles.medium
					: styles.large
			}>
			<Text style={{color: "white"}}>{title}</Text>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	normal: {
		margin: 8,
		padding: 2,
		fontSize: 16,
		backgroundColor: "black",
		textAlign: "center",
		alignContent: "center",
		alignItems: "center",
	},
	medium: {
		margin: 16,
		padding: 4,
		fontSize: 32,
		backgroundColor: "black",
		textAlign: "center",
		alignContent: "center",
		alignItems: "center",
	},
	large: {
		margin: 32,
		padding: 6,
		fontSize: 48,
		backgroundColor: "black",
		textAlign: "center",
		alignContent: "center",
		alignItems: "center",
	},
})

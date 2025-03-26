import {MD3LightTheme as DefaultTheme} from "react-native-paper"
import {Section} from "react-native-paper/lib/typescript/components/Drawer/Drawer"
const theme = {
	...DefaultTheme,
	roundness: 8,
	colors: {
		...DefaultTheme.colors,
		primary: "#1D4ED8",
		accent: "black",
		subtitle: "#0D0F11",
		buttonText: "white",
	},
}

export default theme

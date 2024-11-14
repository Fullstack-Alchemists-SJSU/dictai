import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native"
import {useFonts} from "expo-font"
import {Stack} from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import {useEffect} from "react"
import "react-native-reanimated"

import {useColorScheme} from "@/hooks/useColorScheme"
import {Text} from "react-native"
import Login from "./login"
import {Provider} from "react-redux"
import {store} from "../redux/store"
import {PersistGate} from "redux-persist/integration/react"
import {persistStore} from "redux-persist"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

let persistor = persistStore(store)

export default function RootLayout() {
	const colorScheme = useColorScheme()
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	})

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()
		}
	}, [loaded])

	if (!loaded) {
		return null
	}

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ThemeProvider
					value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
					{/* <Stack initialRouteName='login'>
				<Stack.Screen name='login' />
				<Stack.Screen name='+not-found' />
			</Stack> */}
					<Login />
				</ThemeProvider>
			</PersistGate>
		</Provider>
	)
}

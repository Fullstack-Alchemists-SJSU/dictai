import theme from "../constants/Theme"
import {useFonts} from "expo-font"
import {Stack} from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import {useEffect} from "react"
import "react-native-reanimated"
import {Provider} from "react-redux"
import {store} from "../redux/store"
import {PersistGate} from "redux-persist/integration/react"
import {persistStore} from "redux-persist"
import {PaperProvider} from "react-native-paper"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

let persistor = persistStore(store)

export default function RootLayout() {
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
				<PaperProvider theme={theme}>
					<Stack>
						<Stack.Screen
							name='welcome'
							options={{
								headerShown: false,
							}}
						/>

						<Stack.Screen
							name='register'
							options={{
								headerShown: false,
							}}
						/>

						<Stack.Screen
							name='login'
							options={{
								headerShown: false,
							}}
						/>
					</Stack>
				</PaperProvider>
			</PersistGate>
		</Provider>
	)
}

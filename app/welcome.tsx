import Container from "@/components/Container"
import ThemedButton from "@/components/ThemedButton"
import {ThemedHeader, ThemedSubtitle} from "@/components/ThemedText"
import {header, subtitle} from "@/constants/TextStyle"
import theme from "@/constants/Theme"
import useDevice, {ScreenSize} from "@/hooks/useDevice"
import {useRouter} from "expo-router"
import {Image, View} from "react-native"
import {useTheme} from "react-native-paper"
const welcome = require("../assets/images/welcome.jpeg")

const Welcome = () => {
	const dimension = useDevice()
	const router = useRouter()

	const onCreateAccount = () => {
		router.push("/register")
	}

	const onLogin = () => {
		router.push("/login")
	}

	const onVoiceRecordScreen = () => {
		router.push("/tabs/journal")
	}

	return (
		<Container>
			<View
				style={{
					flexDirection: "column",
					marginVertical: "auto",
				}}>
				<ThemedHeader dimension={dimension} text='Welcome to' />

				<ThemedHeader
					dimension={dimension}
					text=' InnerVoice'
					color={theme.colors.primary}
				/>

				<ThemedSubtitle
					dimension={dimension}
					text='Your voice, your story, your journey.'
					color={theme.colors.subtitle}
				/>

				<Image
					source={welcome}
					style={{
						marginHorizontal: "auto",
						marginVertical: "auto",
						width: dimension == ScreenSize.MEDIUM ? 600 : 300,
						height: dimension == ScreenSize.MEDIUM ? 600 : 350,
						resizeMode: "contain",
					}}
				/>

				<ThemedButton onPress={onCreateAccount} text='Create Account' />

				<ThemedButton
					onPress={onLogin}
					text='Login'
					mode='outlined'
					textColor='black'
				/>

				<ThemedButton
					onPress={onVoiceRecordScreen}
					text='Try Out Journal'
					mode='outlined'
					textColor='black'
				/>
			</View>
		</Container>
	)
}

export default Welcome

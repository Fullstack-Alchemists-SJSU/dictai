import Container from "@/components/Container"
import Spacer from "@/components/Spacer"
import ThemedButton from "@/components/ThemedButton"
import {ThemedHeader, ThemedSubtitle} from "@/components/ThemedText"
import theme from "@/constants/Theme"
import getWindowDimens, {ScreenSize} from "@/utils/getWindowDimens"
import {useRouter} from "expo-router"
import {Image, View} from "react-native"
const welcome = require("../assets/images/welcome.jpeg")

const Welcome = () => {
	const dimension = getWindowDimens()
	const router = useRouter()

	const onCreateAccount = () => {
		router.push("/register")
	}

	const onLogin = () => {
		router.push("/login")
	}

	const onVoiceRecordScreen = () => {
		router.push("/journal")
	}

	const onToDosScreen = () => {
		router.push("/todos")
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

				<Spacer direction='vertical' size={16} />

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

				<ThemedButton
					onPress={onToDosScreen}
					text='Try Out ToDos'
					mode='outlined'
					textColor='black'
				/>
			</View>
		</Container>
	)
}

export default Welcome

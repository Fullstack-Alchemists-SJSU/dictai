import Container from "@/components/Container"
import Spacer from "@/components/Spacer"
import ThemedButton from "@/components/ThemedButton"
import {ThemedHeader, ThemedSubtitle} from "@/components/ThemedText"
import theme from "@/constants/Theme"
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store"
import { refreshToken, verifyToken } from "@/redux/user/userSlice"
import getWindowDimens, {ScreenSize} from "@/utils/getWindowDimens"
import {useRouter} from "expo-router"
import { useEffect } from "react"
import {Image, View} from "react-native"
const welcome = require("../assets/images/welcome.jpeg")

const Welcome = () => {
	const dimension = getWindowDimens()
	const router = useRouter()
	const user = useAppSelector((state: RootState) => state.user)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (user.status.action === "verify" && user.status.code === 401) {
			dispatch(
				refreshToken({
					sub: user.Attributes.sub,
					refreshToken: user.AuthenticationResult.RefreshToken,
				})
			)
		}
		if ((user.status.action === "verify" && user.status.code === 200) || (user.status.action === "refresh" && user.status.code === 200)) {
			router.replace("/(tabs)/journal")
		}
	}, [user.status])

	useEffect(() => {
		if (user.AuthenticationResult.AccessToken) {
			dispatch(
				verifyToken({
					token: user.AuthenticationResult.AccessToken,
					tokenType: user.AuthenticationResult.TokenType,
				})
			)
		}
	}, [user.AuthenticationResult.AccessToken])

	const onCreateAccount = () => {
		router.push("/register")
	}

	const onLogin = () => {
		router.push("/login")
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

			</View>
		</Container>
	)
}

export default Welcome

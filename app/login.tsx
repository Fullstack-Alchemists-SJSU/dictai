import Container from "@/components/Container"
import {useAppDispatch, useAppSelector} from "@/redux/store"
import {login, logout, refreshToken, verifyToken} from "@/redux/user/userSlice"
import {Link, useRouter} from "expo-router"
import {useEffect, useState} from "react"
import {View, StyleSheet} from "react-native"
import {Text, TextInput, Button} from "react-native-paper"
import Spacer from "@/components/Spacer"
import {ThemedHeader, ThemedSubtitle} from "@/components/ThemedText"
import getWindowDimensions from "@/utils/getWindowDimens"
import theme from "@/constants/Theme"

const Login = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const router = useRouter()
	const dimension = getWindowDimensions()

	const currentUser = useAppSelector((state) => state.user)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (currentUser.status.code == 401) {
			dispatch(
				refreshToken({
					sub: currentUser.Attributes.sub,
					refreshToken: currentUser.AuthenticationResult.RefreshToken,
				})
			)
		}
	}, [currentUser])

	useEffect(() => {
		if (currentUser.status.code === 200) {
			router.replace("/(tabs)/journal")
		}
	}, [currentUser.status.code])

	const onLogin = () => {
		dispatch(
			login({
				email,
				password,
			})
		)
	}

	const onLogout = () => {
		dispatch(logout())
	}

	const onVerify = () => {
		dispatch(
			verifyToken({
				token: currentUser.AuthenticationResult.AccessToken,
				tokenType: currentUser.AuthenticationResult.TokenType,
			})
		)
	}

	const onRefresh = () => {
		dispatch(
			refreshToken({
				sub: currentUser.Attributes.sub,
				refreshToken: currentUser.AuthenticationResult.RefreshToken,
			})
		)
	}

	return (
		<Container>
			<View style={styles.container}>
				<ThemedHeader dimension={dimension} text='Login' />
				<ThemedSubtitle
					dimension={dimension}
					text='Your voice, your story, your journey.'
					color={theme.colors.subtitle}
				/>

				<Spacer direction='vertical' size={32} />

				<TextInput
					label='Email'
					value={email}
					onChangeText={setEmail}
					inputMode='email'
					textContentType='emailAddress'
					mode='outlined'
					style={styles.input}
					left={<TextInput.Icon icon='email' />}
				/>

				<Spacer direction='vertical' size={16} />

				<TextInput
					label='Password'
					value={password}
					onChangeText={setPassword}
					textContentType='password'
					secureTextEntry
					mode='outlined'
					style={styles.input}
					left={<TextInput.Icon icon='lock' />}
					right={<TextInput.Icon icon='eye' />}
				/>

				<Spacer direction='vertical' size={24} />

				<Button
					mode='contained'
					onPress={onLogin}
					style={styles.button}
					contentStyle={styles.buttonContent}
				>
					Sign In
				</Button>

				<Spacer direction='vertical' size={16} />

				<View style={styles.footer}>
					<Text style={styles.footerText}>
						Don't have an account?{" "}
						<Link href='/register' style={styles.link}>
							<Text style={styles.linkText}>Sign Up</Text>
						</Link>
					</Text>
				</View>
			</View>
		</Container>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		justifyContent: "center",
		alignContent: "center",
	},
	input: {
		backgroundColor: "#fff",
	},
	button: {
		borderRadius: 8,
	},
	buttonContent: {
		paddingVertical: 8,
	},
	footer: {
		alignItems: "center",
	},
	footerText: {
		color: theme.colors.subtitle,
	},
	link: {
		marginLeft: 4,
	},
	linkText: {
		color: theme.colors.primary,
		fontWeight: "bold",
	},
})

export default Login

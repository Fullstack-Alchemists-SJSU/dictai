import Container from "@/components/Container"
import {useAppDispatch, useAppSelector} from "@/redux/store"
import {Action, login} from "@/redux/user/userSlice"
import {Link, useRouter} from "expo-router"
import {useEffect, useState} from "react"
import {View, StyleSheet} from "react-native"
import {Text} from "react-native-paper"
import Spacer from "@/components/Spacer"
import {ThemedHeader, ThemedSubtitle} from "@/components/ThemedText"
import getWindowDimensions from "@/utils/getWindowDimens"
import theme from "@/constants/Theme"
import ThemedInput from "@/components/ThemedInput"
import ThemedButton from "@/components/ThemedButton"

const Login = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const router = useRouter()
	const dimension = getWindowDimensions()

	const dispatch = useAppDispatch()
	const user = useAppSelector((state) => state.user)
	useEffect(() => {
		if (user.status.action === Action.LOGIN && user.status.code === 200) {
			router.replace("/(tabs)/journal")
		}
	}, [user.status])

	const onLogin = () => {
		dispatch(
			login({
				email,
				password,
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

				<ThemedInput
					label='Email'
					value={email}
					onChangeText={setEmail}
					inputMode='email'
				/>

				<Spacer direction='vertical' size={16} />

				<ThemedInput
					label='Password'
					value={password}
					onChangeText={setPassword}
					secured={true}
				/>

				<Spacer direction='vertical' size={24} />

				<ThemedButton
					text='Sign In'
					onPress={onLogin}
				/>

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

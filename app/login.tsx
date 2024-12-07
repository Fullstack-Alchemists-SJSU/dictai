import Container from "@/components/Container"
import {ScreenHeader} from "@/components/ScreenHeader"
import {useAppDispatch, useAppSelector} from "@/redux/store"
import {login, logout, refreshToken, verifyToken} from "@/redux/user/userSlice"
import {Link} from "expo-router"
import {useEffect, useState} from "react"
import {Text} from "react-native"
import {Button, TextInput} from "react-native-paper"

const Login = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

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
			<TextInput
				label='Enter your email'
				value={email}
				onChangeText={setEmail}
				inputMode='email'
				textContentType='emailAddress'
			/>

			<TextInput
				label='Enter your password'
				value={password}
				onChangeText={setPassword}
				textContentType='password'
				secureTextEntry
			/>

			<Button onPress={onLogin}>Login</Button>
			<Button onPress={onLogout}>Logout</Button>

			{currentUser &&
				currentUser.AuthenticationResult &&
				currentUser.AuthenticationResult.AccessToken.length > 0 && (
					<>
						<Button onPress={onVerify}>Verify</Button>
						<Button onPress={onRefresh}>Refresh</Button>
						<Text>Message: {currentUser.status.message}</Text>
					</>
				)}

			<Text>
				Don't have an account? <Link href='/register'>Sign Up</Link>
			</Text>
		</Container>
	)
}

export default Login

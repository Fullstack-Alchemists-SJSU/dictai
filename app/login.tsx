import {ScreenHeader} from "@/components/ScreenHeader"
import ThemedButton from "@/components/ThemedButton"
import ThemedTextInput from "@/components/ThemedTextInput"
import {useAppDispatch, useAppSelector} from "@/redux/store"
import {login, logout, refreshToken, verifyToken} from "@/redux/user/userSlice"
import {Link} from "expo-router"
import {useEffect, useState} from "react"
import {Text} from "react-native"

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
		<>
			<ScreenHeader title='Login' />
			<Text>Login screen asd</Text>
			<ThemedTextInput
				placeholder='Enter your email'
				value={email}
				onChangeText={setEmail}
				inputMode='email'
				textContentType='emailAddress'
			/>

			<ThemedTextInput
				placeholder='Enter your password'
				value={password}
				onChangeText={setPassword}
				textContentType='password'
				secureTextEntry
			/>

			<ThemedButton onPress={onLogin} title='Login' />
			<ThemedButton onPress={onLogout} title='Logout' />

			{currentUser.AuthenticationResult.AccessToken.length > 0 && (
				<>
					<ThemedButton onPress={onVerify} title='Verify' />
					<ThemedButton onPress={onRefresh} title='Refresh' />
					<Text>Message: {currentUser.status.message}</Text>
				</>
			)}

			<Text>
				Don't have an account? <Link href='/register'>Sign Up</Link>
			</Text>
		</>
	)
}

export default Login

import ThemedButton from "@/components/ThemedButton"
import ThemedTextInput from "@/components/ThemedTextInput"
import {useAppDispatch, useAppSelector} from "@/redux/store"
import {login, logout, verifyToken} from "@/redux/user/userSlice"
import {useState} from "react"
import {Text} from "react-native"
import base64 from "react-native-base64"

const Login = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const currentUser = useAppSelector((state) => state.user)
	const dispatch = useAppDispatch()

	const onLogin = () => {
		dispatch(
			login({
				email,
				password: base64.encode(password),
			})
		)
	}

	const onLogout = () => {
		dispatch(logout())
	}

	const onVerify = () => {
		dispatch(
			verifyToken({
				token: currentUser.accessToken,
				tokenType: currentUser.tokenType,
			})
		)
	}
	return (
		<>
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

			{currentUser.accessToken.length > 0 && (
				<>
					<ThemedButton onPress={onVerify} title='Verify' />
					<Text>Message: {currentUser.status.message}</Text>
				</>
			)}
		</>
	)
}

export default Login

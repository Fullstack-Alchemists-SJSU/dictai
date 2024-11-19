import {SIGN_UP_URL} from "@/api/constants"
import {GenericResponse} from "@/api/types"
import {ScreenHeader} from "@/components/ScreenHeader"
import ThemedButton from "@/components/ThemedButton"
import ThemedTextInput from "@/components/ThemedTextInput"
import axios, {AxiosError} from "axios"
import {useRouter} from "expo-router"
import {useEffect, useState} from "react"
import {Modal} from "react-native"
import DateTimePicker from "react-native-ui-datepicker"
import base64 from "react-native-base64"

const Register = () => {
	const router = useRouter()

	const [givenName, setGivenName] = useState("")
	const [lastName, setLastName] = useState("")
	const [email, setEmail] = useState("")
	const [phoneNumber, setPhone] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [birthdate, setBirthdate] = useState("")
	const [gender, setGender] = useState("select")

	const [datePickerVisible, setDatePickerVisible] = useState(false)

	const onGenderChange = (e: any) => {
		setGender(e.target.value)
	}

	useEffect(() => {
		console.log("Gender: ", gender)
	}, [gender])

	const onSelectBirthdate = () => {
		setDatePickerVisible(!datePickerVisible)
	}

	const onDateChange = (date: any) => {
		const dateObj = new Date(date.date)
		setBirthdate(
			`${dateObj.getFullYear()}-${
				dateObj.getMonth() + 1
			}-${dateObj.getDate()}`
		)
		setDatePickerVisible(false)
	}

	function register() {
		const response = axios
			.post<GenericResponse>(
				SIGN_UP_URL,
				{
					givenName,
					lastName,
					email,
					gender,
					phoneNumber,
					birthdate,
				},
				{headers: {password: base64.encode(password)}}
			)
			.then((response) => {
				if (response.status == 201) {
					router.replace("/register")
				} else {
					console.log("Register response: ", response)
				}
			})
			.catch((e) => {
				if (e instanceof AxiosError) {
					return {
						message: e.response?.data.message,
						statusCode: e.status,
					}
				}
				console.log(e)
				return undefined
			})
	}

	const onRegister = () => {
		register()
	}

	return (
		<>
			<ScreenHeader title='Register' />
			<ThemedTextInput
				placeholder='Given Name'
				value={givenName}
				onChangeText={setGivenName}
				inputMode='text'
				textContentType='givenName'
			/>

			<ThemedTextInput
				placeholder='Family Name'
				value={lastName}
				onChangeText={setLastName}
				inputMode='text'
				textContentType='familyName'
			/>
			<ThemedTextInput
				placeholder='Email'
				value={email}
				onChangeText={setEmail}
				inputMode='email'
				textContentType='emailAddress'
			/>

			<ThemedTextInput
				placeholder='Phone'
				value={phoneNumber}
				onChangeText={setPhone}
				textContentType='telephoneNumber'
			/>

			<ThemedTextInput
				placeholder='Password'
				value={password}
				onChangeText={setPassword}
				textContentType='password'
				secureTextEntry
			/>

			<ThemedTextInput
				placeholder='Confirm password'
				value={confirmPassword}
				onChangeText={setConfirmPassword}
				textContentType='password'
				secureTextEntry
			/>

			<Modal visible={datePickerVisible}>
				<ThemedButton title='Close' onPress={onSelectBirthdate} />
				<DateTimePicker mode='single' onChange={onDateChange} />
			</Modal>

			<ThemedButton
				title='Select birthdate'
				onPress={onSelectBirthdate}
			/>

			<select value={gender} onChange={onGenderChange}>
				<option value='select'>Select</option>
				<option value='male'>Male</option>
				<option value='female'>Female</option>
			</select>

			<ThemedButton title='Sign Up' onPress={onRegister} />
		</>
	)
}

export default Register

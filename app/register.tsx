import {SIGN_UP_URL} from "@/api/constants"
import {GenericResponse} from "@/api/types"
import {ScreenHeader} from "@/components/ScreenHeader"
import axios, {AxiosError} from "axios"
import {useRouter} from "expo-router"
import {useEffect, useState} from "react"
import {Modal, View} from "react-native"
import DateTimePicker from "react-native-ui-datepicker"
import base64 from "react-native-base64"
import ThemedInput from "@/components/ThemedInput"
import ThemedButton from "@/components/ThemedButton"
import {List, RadioButton, Text, useTheme} from "react-native-paper"
import Container from "@/components/Container"
import {ThemedHeader, ThemedSubtitle} from "@/components/ThemedText"
import useDevice from "@/hooks/useDevice"
import Spacer from "@/components/Spacer"
import Dropdown, {IOption} from "@/components/Dropdown"
import theme from "@/constants/Theme"

const Register = () => {
	const router = useRouter()
	const dimension = useDevice()

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
		<Container>
			<Spacer direction='vertical' size={24} />
			<ThemedHeader dimension={dimension} text='Create Account' />
			<ThemedSubtitle
				dimension={dimension}
				text='Your voice, your story, your journey.'
				color={theme.colors.subtitle}
			/>

			<Spacer direction='vertical' size={32} />

			<ThemedInput
				label='Given Name'
				value={givenName}
				onChangeText={setGivenName}
				inputMode='text'
			/>

			<ThemedInput
				label='Family Name'
				value={lastName}
				onChangeText={setLastName}
				inputMode='text'
			/>
			<ThemedInput
				label='Email'
				value={email}
				onChangeText={setEmail}
				inputMode='email'
			/>

			<ThemedInput
				label='Phone'
				value={phoneNumber}
				onChangeText={setPhone}
			/>

			<ThemedInput
				label='Password'
				value={password}
				onChangeText={setPassword}
				secured
			/>

			<ThemedInput
				label='Confirm password'
				value={confirmPassword}
				onChangeText={setConfirmPassword}
				secured
			/>

			<Modal visible={datePickerVisible}>
				<View style={{marginHorizontal: 16}}>
					<DateTimePicker mode='single' onChange={onDateChange} />
					<ThemedButton
						onPress={onSelectBirthdate}
						text='Close'
						mode='outlined'
						textColor='black'
					/>
				</View>
			</Modal>

			<ThemedButton
				onPress={onSelectBirthdate}
				text={birthdate.length == 0 ? "Select birthdate" : birthdate}
				mode='outlined'
				textAlign='left'
				textColor='black'
			/>
			<Dropdown
				dimension={dimension}
				options={[
					{text: "Male", value: "male"},
					{text: "Female", value: "female"},
				]}
				onOptionSelected={(option: IOption) => {
					setGender(option.value)
				}}
			/>
			<ThemedButton onPress={onRegister} text='Create Account' />

			<Spacer direction='vertical' size={16} />

			<Text style={{textAlign: "center"}}>
				Already have an account{" "}
				<Text
					style={{fontWeight: "bold", color: theme.colors.primary}}
					onPress={() => router.push("/login")}>
					Login
				</Text>
			</Text>
		</Container>
	)
}

export default Register

import { SIGN_UP_URL } from "@/api/constants"
import { GenericResponse } from "@/api/types"
import axios, { AxiosError } from "axios"
import { useRouter } from "expo-router"
import { useState, useRef } from "react"
import { Modal, ScrollView, View, StyleSheet } from "react-native"
import DateTimePicker from "react-native-ui-datepicker"
import base64 from "react-native-base64"
import ThemedInput from "@/components/ThemedInput"
import ThemedButton from "@/components/ThemedButton"
import { Text, TextInput, Button, ProgressBar } from "react-native-paper"
import Container from "@/components/Container"
import { ThemedHeader, ThemedSubtitle } from "@/components/ThemedText"
import getWindowDimensions from "@/utils/getWindowDimens"
import Spacer from "@/components/Spacer"
import Dropdown, { IOption } from "@/components/Dropdown"
import theme from "@/constants/Theme"
import { validateRegistration } from "@/api/validator"
import { LoadingDialog } from "@/components/LoadingDialog"
import notifyMessage from "@/components/Toast"

interface PasswordStrength {
	score: number;
	label: string;
	color: string;
}

const getPasswordStrength = (password: string): PasswordStrength => {
	const hasLower = /[a-z]/.test(password);
	const hasUpper = /[A-Z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
	const length = password.length;

	let score = 0;
	if (length > 8) score += 1;
	if (length > 12) score += 1;
	if (hasLower) score += 1;
	if (hasUpper) score += 1;
	if (hasNumber) score += 1;
	if (hasSpecial) score += 1;

	const strengthMap: Record<number, PasswordStrength> = {
		0: { score: 0, label: "Very Weak", color: "#FF4444" },
		1: { score: 0.2, label: "Weak", color: "#FFA700" },
		2: { score: 0.4, label: "Fair", color: "#FFCC00" },
		3: { score: 0.6, label: "Good", color: "#90EE90" },
		4: { score: 0.8, label: "Strong", color: "#00CC00" },
		5: { score: 1, label: "Very Strong", color: "#008000" },
	};

	return strengthMap[Math.min(5, score)];
};

const Register = () => {
	const router = useRouter()
	const dimension = getWindowDimensions()

	const [givenName, setGivenName] = useState("Aditya")
	const [lastName, setLastName] = useState("Kulkarni")
	const [email, setEmail] = useState("kulkarniaditya1997@gmail.com")
	const [phoneNumber, setPhone] = useState("4083936393")
	const [password, setPassword] = useState("Aditya@1997")
	const [confirmPassword, setConfirmPassword] = useState("Aditya@1997")
	const [birthDate, setBirthdate] = useState("1997-12-31")
	const [gender, setGender] = useState("male")
	const [loading, setLoading] = useState(false)
	const [datePickerVisible, setDatePickerVisible] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const passwordStrength = getPasswordStrength(password)

	const lastNameRef = useRef(null)
	const emailRef = useRef(null)
	const phoneRef = useRef(null)
	const passwordRef = useRef(null)
	const confirmPasswordRef = useRef(null)

	const onSelectBirthdate = () => {
		setDatePickerVisible(!datePickerVisible)
	}

	const onDateChange = (date: any) => {
		const dateObj = new Date(date.date)
		
		const month = String(dateObj.getMonth() + 1).padStart(2, '0')
		const day = String(dateObj.getDate()).padStart(2, '0')
		setBirthdate(
			`${dateObj.getFullYear()}-${month}-${day}`
		)
		setDatePickerVisible(false)
	}

	async function register() {
		try {
			const response = await axios
				.post<GenericResponse>(
					SIGN_UP_URL,
					{
						givenName,
						lastName,
						email,
						gender,
						phoneNumber,
						birthdate: birthDate,
					},
					{ headers: { password: base64.encode(password) } }
				)

			if (response) {
				console.log("res", response)
				if (response.status == 201) {
					notifyMessage("Registration successful")
					router.replace("/login")
				} else {
					notifyMessage("Something went wrong")
				}
			}

		} catch (e) {
			if (e instanceof AxiosError) {
				notifyMessage(e.response?.data.message)
				return {
					message: e.response?.data.message,
					statusCode: e.status,
				}
			}
			console.log("err", e)
			return undefined
		}
	}

	const onRegister = async () => {
		const { errors, isValid } = validateRegistration(givenName, lastName, email, phoneNumber, password, confirmPassword, birthDate, gender)
		console.log("errors", errors)
		setErrors(errors)
		if (isValid) {
			setLoading(true)
			await register()
			setLoading(false)
		}
	}

	return (
		<Container>
			<LoadingDialog
				open={loading}
			/>
			<ScrollView showsVerticalScrollIndicator={false}>
				<Spacer direction='vertical' size={24} />
				<ThemedHeader dimension={dimension} text='Create Account' />
				<ThemedSubtitle
					dimension={dimension}
					text='Your voice, your story, your journey.'
					color={theme.colors.subtitle}
				/>

			

				<ThemedSubtitle text="Given Name" variant="subtitle" dimension={dimension} />
				<ThemedInput
					value={givenName}
					onChangeText={setGivenName}
					inputMode='text'
					onSubmitEditing={() => (lastNameRef.current as any).focus()}
				/>
				{errors.givenName && <ThemedSubtitle text={errors.givenName} variant="error" dimension={dimension} />}


				<ThemedSubtitle text='Family Name' variant="subtitle" dimension={dimension} />
				<ThemedInput
					ref={lastNameRef}
					value={lastName}
					onChangeText={setLastName}
					inputMode='text'
					onSubmitEditing={() => (emailRef.current as any).focus()}
				/>
				{errors.lastName && <ThemedSubtitle text={errors.lastName} variant="error" dimension={dimension} />}

				<ThemedSubtitle text='Email' variant="subtitle" dimension={dimension} />
				<ThemedInput
					ref={emailRef}
					value={email}
					onChangeText={setEmail}
					inputMode='email'
					onSubmitEditing={() => (phoneRef.current as any).focus()}
				/>
				{errors.email && <ThemedSubtitle text={errors.email} variant="error" dimension={dimension} />}

				<ThemedSubtitle text='Phone' variant="subtitle" dimension={dimension} />
				<ThemedInput
					ref={phoneRef}
					value={phoneNumber}
					onChangeText={setPhone}
					inputMode="tel"
					onSubmitEditing={() => (passwordRef.current as any).focus()}
				/>
				{errors.phoneNumber && <ThemedSubtitle text={errors.phoneNumber} variant="error" dimension={dimension} />}


				<ThemedSubtitle text='Password' variant="subtitle" dimension={dimension} />
				<ThemedInput
					ref={passwordRef}
					value={password}
					onChangeText={setPassword}
					secured
					onSubmitEditing={() => (confirmPasswordRef.current as any).focus()}
				/>
				{errors.password && <ThemedSubtitle text={errors.password} variant="error" dimension={dimension} />}

				<ThemedSubtitle text='Confirm password' variant="subtitle" dimension={dimension} />
				<ThemedInput
					ref={confirmPasswordRef}
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					secured
					returnKeyType="done"
				/>
				{errors.confirmPassword && <ThemedSubtitle text={errors.confirmPassword} variant="error" dimension={dimension} />}

				<Modal visible={datePickerVisible}>
					<View style={{ marginHorizontal: 16 }}>
						<DateTimePicker mode='single' onChange={onDateChange} />
						<ThemedButton
							onPress={onSelectBirthdate}
							text='Close'
							mode='outlined'
							textColor='black'
						/>
					</View>
				</Modal>

				<ThemedSubtitle text='Date of Birth' variant="subtitle" dimension={dimension} />
				<ThemedButton
					onPress={onSelectBirthdate}
					text={birthDate.length == 0 ? "Select birthdate" : birthDate}
					mode='outlined'
					textAlign='left'
					textColor='black'
				/>
				{errors.birthDate && <ThemedSubtitle text={errors.birthDate} variant="error" dimension={dimension} />}

				<ThemedSubtitle text='Gender' variant="subtitle" dimension={dimension} />
				<Dropdown
					dimension={dimension}
					options={[
						{ text: "Male", value: "male" },
						{ text: "Female", value: "female" },
					]}
					onOptionSelected={(option: IOption) => setGender(option.value)}
					defaultSelection="Select Gender"
				/>
				{errors.gender && <ThemedSubtitle text={errors.gender} variant="error" dimension={dimension} />}

				<Spacer direction='vertical' size={16} />

				<TextInput
					ref={passwordRef}
					label='Password'
					value={password}
					onChangeText={setPassword}
					mode='outlined'
					style={styles.input}
					secureTextEntry={!showPassword}
					left={<TextInput.Icon icon='lock' />}
					right={
						<TextInput.Icon
							icon={showPassword ? "eye-off" : "eye"}
							onPress={() => setShowPassword(!showPassword)}
						/>
					}
					error={!!errors.password}
					onSubmitEditing={() => (confirmPasswordRef.current as any).focus()}
				/>
				{password.length > 0 && (
					<View style={styles.strengthContainer}>
						<ProgressBar
							progress={passwordStrength.score}
							color={passwordStrength.color}
							style={styles.strengthBar}
						/>
						<Text style={[styles.strengthText, { color: passwordStrength.color }]}>
							{passwordStrength.label}
						</Text>
					</View>
				)}
				{errors.password && (
					<Text style={styles.errorText}>{errors.password}</Text>
				)}

				<Spacer direction='vertical' size={16} />

				<TextInput
					ref={confirmPasswordRef}
					label='Confirm Password'
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					mode='outlined'
					style={styles.input}
					secureTextEntry={!showConfirmPassword}
					left={<TextInput.Icon icon='lock' />}
					right={
						<TextInput.Icon
							icon={showConfirmPassword ? "eye-off" : "eye"}
							onPress={() => setShowConfirmPassword(!showConfirmPassword)}
						/>
					}
					error={!!errors.confirmPassword}
				/>
				{errors.confirmPassword && (
					<Text style={styles.errorText}>{errors.confirmPassword}</Text>
				)}

				<Spacer direction='vertical' size={24} />

				<ThemedButton onPress={onRegister} text='Create Account' />

				<Spacer direction='vertical' size={16} />

				<Text style={{ textAlign: "center" }}>
					Already have an account{" "}
					<Text
						style={{ fontWeight: "bold", color: theme.colors.primary }}
						onPress={() => router.push("/login")}>
						Login
					</Text>
				</Text>
			</ScrollView>
		</Container>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
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
	linkText: {
		color: theme.colors.primary,
		fontWeight: "bold",
	},
	errorText: {
		color: theme.colors.error,
		fontSize: 12,
		marginTop: 4,
		marginLeft: 8,
	},
	strengthContainer: {
		marginTop: 8,
		marginBottom: 4,
	},
	strengthBar: {
		height: 4,
		borderRadius: 2,
	},
	strengthText: {
		fontSize: 12,
		marginTop: 4,
		textAlign: 'right',
	},
})

export default Register

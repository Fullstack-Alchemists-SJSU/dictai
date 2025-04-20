import {LOGIN_URL, REFRESH_URL, LOGOUT_URL, VERIFY_URL} from "@/api/constants"
import {AuthGenericResponse, AuthResponse, GenericResponse} from "@/api/types"
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios, {AxiosError} from "axios"
import base64 from "react-native-base64"

export enum Action {
	DEFAULT = "default",
	LOGIN = "login",
	VERIFY = "verify",
	REFRESH = "refresh",
	LOGOUT = "logout",
}

export type UserState = AuthResponse & {
	status: {
		action: Action
		code: number
		message: string
		type: "default" | "pending" | "fulfilled" | "rejected"
	}
}

const initialState: UserState = {
	$metadata: {
		httpStatusCode: -1,
	},
	AuthenticationResult: {
		AccessToken: "",
		IdToken: "",
		RefreshToken: "",
		ExpiresIn: 0,
		TokenType: "",
	},
	status: {
		action: Action.DEFAULT,
		code: -1,
		message: "",
		type: "default",
	},
	Attributes: {
		sub: "",
		given_name: "",
		family_name: "",
		email: "",
		phone_number: "",
		gender: "",
		birthdate: "",
	},
}

export const login = createAsyncThunk(
	"login",
	async ({email, password}: {email: string; password: string}) => {
		try {
			const response = await axios.post<AuthGenericResponse>(
				LOGIN_URL,
				{email},
				{headers: {password: base64.encode(password)}}
			)
			return response.data
		} catch (e) {
			if (e instanceof AxiosError) {
				return {message: e.response?.data.message, statusCode: e.status}
			}
			console.log(e)
			return undefined
		}
	}
)

export const verifyToken = createAsyncThunk(
	"verify",
	async ({token, tokenType}: {token: string; tokenType: string}) => {
		try {
			const response = await axios.post<GenericResponse>(
				VERIFY_URL,
				{},
				{headers: {Authorization: `${tokenType} ${token}`}}
			)
			return {message: response.data.message, statusCode: response.status}
		} catch (e) {
			if (e instanceof AxiosError) {
				return {message: e.response?.data.message, statusCode: e.status}
			}
			console.log(e)
			return undefined
		}
	}
)

export const refreshToken = createAsyncThunk(
	"refresh",
	async ({sub, refreshToken}: {sub: string; refreshToken: string}) => {
		try {
			const refreshResponse = await axios.post<AuthGenericResponse>(
				REFRESH_URL,
				{sub},
				{headers: {Authorization: refreshToken}}
			)
			return refreshResponse.data
		} catch (e) {
			if (e instanceof AxiosError) {
				return {message: e.response?.data.message, statusCode: e.status}
			}
			console.log(e)
			return undefined
		}
	}
)

export const logoutUser = createAsyncThunk("logout", async (token: string) => {
	try {
		const response = await axios.post(LOGOUT_URL, {}, {headers: {Authorization: `Bearer ${token}`}})
		return response.data
	} catch (e) {
		console.log(e)
		if (e instanceof AxiosError) {
			return {message: e.response?.data.message, statusCode: e.status}
		}
		return undefined
	}
})
export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		
	},
	extraReducers: (builder) => {
		/**
		 * Login
		 */
		builder
			.addCase(login.pending, (state) => {
				state.status = {
					action: Action.LOGIN,
					code: -1,
					message: "",
					type: "pending",
				}
			})
			.addCase(login.fulfilled, (state, action) => {
				if (action.payload === undefined) {
					return {
						...initialState,
						status: (state.status = {
							action: Action.LOGIN,
							code: -1,
							message: "",
							type: "fulfilled",
						}),
					}
				} else {
					const authResponse = action.payload as AuthResponse
					state.status = {
						action: Action.LOGIN,
						code: authResponse.$metadata.httpStatusCode,
						message: "Login success",
						type: "fulfilled",
					}
					state.$metadata = authResponse.$metadata
					state.AuthenticationResult =
						authResponse.AuthenticationResult

					state.Attributes = authResponse.Attributes
				}
			})
			.addCase(login.rejected, (state, action) => {
				const authResponse = action.payload as GenericResponse
				state.status = {
					action: Action.LOGIN,
					code: authResponse.statusCode,
					message: authResponse.message,
					type: "rejected",
				}
			})

		/**
		 * Verify Token
		 */
		builder
			.addCase(verifyToken.pending, (state) => {
				state.status = {
					action: Action.VERIFY,
					code: -1,
					message: "",
					type: "pending",
				}
			})
			.addCase(verifyToken.fulfilled, (state, action) => {
				state.status = {
					action: Action.VERIFY,
					code: action.payload?.statusCode ?? -1,
					message: action.payload?.message ?? "",
					type: "fulfilled",
				}
			})
			.addCase(verifyToken.rejected, (state, action) => {
				const authResponse = action.payload as GenericResponse
				state.status = {
					action: Action.VERIFY,
					code: authResponse.statusCode,
					message: authResponse.message,
					type: "rejected",
				}
			})

		/**
		 * Refresh Token
		 */
		builder
			.addCase(refreshToken.pending, (state) => {
				state.status = {
					action: Action.REFRESH,
					code: -1,
					message: "",
					type: "pending",
				}
			})
			.addCase(refreshToken.fulfilled, (state, action) => {
				if (action.payload === undefined) {
					return {
						...initialState,
						status: (state.status = {
							action: Action.REFRESH,
							code: -1,
							message: "",
							type: "fulfilled",
						}),
					}
				} else {
					const authResponse =
						action.payload as unknown as AuthResponse
					state.status = {
						action: Action.REFRESH,
						code: authResponse.$metadata.httpStatusCode,
						message: "Token refreshed",
						type: "fulfilled",
					}
					state.$metadata = authResponse.$metadata
					state.AuthenticationResult = {
						...authResponse.AuthenticationResult,
						RefreshToken: state.AuthenticationResult.RefreshToken,
					}
				}
			})
			.addCase(refreshToken.rejected, (state, action) => {
				const authResponse = action.payload as GenericResponse
				state.status = {
					action: Action.REFRESH,
					code: authResponse.statusCode,
					message: authResponse.message,
					type: "rejected",
				}
			})

		/**
		 * Logout
		 */
		builder
			.addCase(logoutUser.pending, (state) => {
				state.status = {
					action: Action.LOGOUT,
					code: -1,
					message: "",
					type: "pending",
				}
			})
			.addCase(logoutUser.fulfilled, (state, action) => {
				state.status = {
					action: Action.LOGOUT,
					code: action.payload?.statusCode ?? -1,
					message: action.payload?.message ?? "",
					type: "fulfilled",
				}
			})
			.addCase(logoutUser.rejected, (state, action) => {
				const authResponse = action.payload as GenericResponse
				state.status = {
					action: Action.LOGOUT,
					code: authResponse.statusCode,
					message: authResponse.message,
					type: "rejected",
				}
			})
	},
})

export default userSlice.reducer

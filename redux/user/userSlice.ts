import {LOGIN_URL, VERIFY_URL} from "@/api/constants"
import {AuthResponse, VerifyResponse} from "@/api/types"
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"
import {createAppAsyncThunk} from "../store"

export interface UserState {
	accessToken: string
	idToken: string
	refreshToken: string
	expiresIn: number
	status: {
		code: number
		message: string
		type: "default" | "pending" | "fulfilled" | "rejected"
	}
	tokenType: string
}

const initialState: UserState = {
	accessToken: "",
	idToken: "",
	refreshToken: "",
	expiresIn: 0,
	status: {
		code: -1,
		message: "",
		type: "default",
	},
	tokenType: "",
}

export const login = createAsyncThunk(
	"login",
	async ({email, password}: {email: string; password: string}) => {
		try {
			const response = await axios.post<AuthResponse>(
				LOGIN_URL,
				{email},
				{headers: {password}}
			)
			return response.data
		} catch (e) {
			console.log(e)
			return undefined
		}
	}
)

export const verifyToken = createAsyncThunk(
	"verify",
	async ({token, tokenType}: {token: string; tokenType: string}) => {
		try {
			const response = await axios.post<VerifyResponse>(
				VERIFY_URL,
				{},
				{headers: {Authorization: `${tokenType} ${token}`}}
			)

			return {message: response.data.message, statusCode: response.status}
		} catch (e) {
			console.log(e)
			return undefined
		}
	}
)

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		logout: (state) => {
			return initialState
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.status = {
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
							code: -1,
							message: "",
							type: "fulfilled",
						}),
					}
				} else {
					state.status = {
						code: action.payload.$metadata.httpStatusCode,
						message: "Login success",
						type: "fulfilled",
					}
					state.accessToken =
						action.payload.AuthenticationResult.AccessToken
					state.idToken = action.payload.AuthenticationResult.IdToken
					state.refreshToken =
						action.payload.AuthenticationResult.RefreshToken
					state.expiresIn =
						action.payload.AuthenticationResult.ExpiresIn
					state.tokenType =
						action.payload.AuthenticationResult.TokenType
				}
			})
			.addCase(login.rejected, (state, action) => {
				state.status = {
					code: -1,
					message: "",
					type: "rejected",
				}
			})

		builder
			.addCase(verifyToken.pending, (state) => {
				state.status = {
					code: -1,
					message: "",
					type: "pending",
				}
			})
			.addCase(verifyToken.fulfilled, (state, action) => {
				state.status = {
					code: action.payload?.statusCode ?? -1,
					message: action.payload?.message ?? "",
					type: "fulfilled",
				}
				console.log("verify: ", action.payload)
			})
			.addCase(verifyToken.rejected, (state) => {
				state.status = {
					code: -1,
					message: "",
					type: "rejected",
				}
			})
	},
})

export const {logout} = userSlice.actions
export default userSlice.reducer

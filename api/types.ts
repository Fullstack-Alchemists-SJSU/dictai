export interface AuthResponse {
	$metadata: {
		httpStatusCode: number
	}
	AuthenticationResult: {
		AccessToken: string
		ExpiresIn: number
		IdToken: string
		RefreshToken: string
		TokenType: string
	}
	Attributes: Attributes
}

export interface GenericResponse {
	message: string
	statusCode: number
}

export interface Attributes {
	sub: string
	birthdate: string
	gender: string
	given_name: string
	phone_number: string
	family_name: string
	email: string
}

export type AuthGenericResponse = AuthResponse | GenericResponse

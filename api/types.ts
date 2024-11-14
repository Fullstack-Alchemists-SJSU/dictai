export interface AuthResponse {
	$metadata: {
		httpStatusCode: 200
	}
	AuthenticationResult: {
		AccessToken: string
		ExpiresIn: number
		IdToken: string
		RefreshToken: string
		TokenType: string
	}
}

export interface VerifyResponse {
	message: string
	statusCode: number
}

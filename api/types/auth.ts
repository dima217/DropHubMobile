export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    profile: {
      id: string;
      firstName: string;
      avatarUrl: string | null;
    };
  };
}

export interface SignUpInitRequest {
  email: string;
}

export interface SignUpInitResponse {
  message: string;
}

export interface SignUpConfirmRequest {
  email: string;
  password: string;
  firstName: string;
}

export interface SignUpConfirmResponse {
  accessToken: string;
  refreshToken: string;
  avatarKey: string;
  uploadUrl: string;
}

export interface MeResponse {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ResetPasswordInitRequest { 
  email: string;
}

export interface ResetPasswordConfirmRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface SignUpVerifyCodeRequest {
  email: string;
  code: string;
}
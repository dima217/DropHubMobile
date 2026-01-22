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
      lastName: string;
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
  lastName: string;
}

export interface SignUpConfirmResponse {
  accessToken: string;
  refreshToken: string;
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

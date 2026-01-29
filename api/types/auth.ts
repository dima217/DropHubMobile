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
  customAvatarNumber?: number;
}

export interface SignUpConfirmResponse {
  accessToken: string;
  refreshToken: string;
  avatarUrl?: string | null;
  uploadUrl?: string | null;
  publicUrl?: string | null;
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

export interface ResetPasswordConfirmResponse {
  success: boolean;
}

export interface SignUpVerifyCodeRequest {
  email: string;
  code: string;
}

export interface SignUpVerifyCodeResponse {
  verified: boolean;
}
export interface UpdateProfileRequest {
  firstName?: string;
  avatarUrl?: string;
}

export interface ProfileResponse {
  id: number;
  firstName: string;
  avatarUrl: string;
}

export interface UpdateProfileResponse {
  id: number;
  firstName: string;
  avatarUrl: string;
}

export interface ProfileUploadUrlResponse {
  uploadUrl: string;
  publicUrl: string;
}

export interface AddFriendRequest {
  userId: number;
}

export interface AddFriendResponse {
  success: boolean;
  message?: string;
}
import {
  useSignUpInitMutation,
  useSignUpMutation,
  useSignUpVerifyCodeMutation,
  useUpdateProfileMutation,
} from "@/api/authApi";
import { secureStore } from "@/services/secureStore";
import { createUploader, UploadProvider } from "@/services/upload/UploaderFactory";
import { isDefaultImage } from "@/shared/MediaUploader/utils";
import { setCredentials } from "@/store/slices/authSlice";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { SignUpFormData } from "../components/FormWrapper";
import { useSignUpFormContext } from "./useSignUpFormContext";

export const useSignUpCodeFlow = () => {
  const { step, formData, setStep, resetForm } = useSignUpFormContext();
  const dispatch = useDispatch();
  const router = useRouter();
  const uploader = createUploader(UploadProvider.MINIO);

  const [signUpInit] = useSignUpInitMutation();
  const [signUpVerifyCode, { isLoading: isVerifying }] =
    useSignUpVerifyCodeMutation();
  const [signUp] = useSignUpMutation();
  const [updateProfile] = useUpdateProfileMutation();

  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  const closeErrorModal = () => setShowErrorModal(false);
  const closeCodeModal = () => setShowCodeModal(false);

  const sendCodeIfNeeded = useCallback(async () => {
    if (step === 1 && formData.email && !codeSent) {
      try {
        await signUpInit({ email: formData.email }).unwrap();
        setCodeSent(true);
        setShowCodeModal(true);
      } catch (error: any) {
        let errorMsg = "Failed to send code";

        const status = error?.status;
        const data = error?.data;

        if (status === 409) {
          errorMsg = "Email already exists";
        } else if (data?.message) {
          errorMsg = data.message;
        }

        setErrorMessage(errorMsg);
        setShowErrorModal(true);
        setStep(0);
        setCodeSent(false);
      }
    }
  }, [codeSent, formData.email, setStep, signUpInit, step]);

  const verifyCodeIfNeeded = useCallback(async () => {
    if (step === 2 && formData.email && formData.code && !codeVerified) {
      try {
        console.log(formData.email, formData.code);
        const result = await signUpVerifyCode({
          email: formData.email,
          code: formData.code,
        }).unwrap();
        console.log(result);
        setCodeVerified(result.verified);
        if (result.verified) {
          setStep(2);
        } else {
          setErrorMessage("Invalid verification code");
          setShowErrorModal(true);
          setStep(1);
          setCodeVerified(false);
        }
      } catch (error: any) {
        let errorMsg = "Failed to verify code";

        const data = error?.data;
        if (data?.message) {
          errorMsg = data.message;
        }

        setErrorMessage(errorMsg);
        setShowErrorModal(true);
        setStep(1);
        setCodeVerified(false);
      }
    }
  }, [
    codeVerified,
    formData.code,
    formData.email,
    setStep,
    signUpVerifyCode,
    step,
  ]);

  const handleResendCode = useCallback(async () => {
    if (!formData.email) return;

    try {
      await signUpInit({ email: formData.email }).unwrap();
      setCodeSent(true);
      setShowCodeModal(true);
    } catch (error: any) {
      let errorMsg = "Failed to resend code";

      const data = error?.data;
      if (data?.message) {
        errorMsg = data.message;
      }

      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    }
  }, [formData.email, signUpInit]);

  const handleFinalSubmit = async (finalData: Partial<SignUpFormData>) => {
    if (
      !finalData.email ||
      !finalData.code ||
      !finalData.password ||
      !finalData.username ||
      !finalData.avatar
    ) {
      return;
    }

    const customAvatar = isDefaultImage(finalData.avatar);

    console.log(finalData.avatar);
    try {
      const result = await signUp({
        email: finalData.email,
        password: finalData.password,
        firstName: finalData.username,
        customAvatarNumber: customAvatar
          ? Number(finalData.avatar) + 1
          : undefined,
      }).unwrap();

      if (result.accessToken) {
        await secureStore.setAccessToken(result.accessToken);
      }
      if (result.refreshToken) {
        await secureStore.setRefreshToken(result.refreshToken);
      }

      console.log("avatarUrl: ", result.avatarUrl);
      if (!customAvatar) {
        const downloadUrl = await uploader.upload(
          result.avatarUrl,
          finalData.avatar
        );
        result.avatarUrl = downloadUrl;
        console.log("downloadUrl: ", downloadUrl);
      }

      const userData = {
        email: finalData.email,
        username: finalData.username,
        avatarUrl: result.avatarUrl,
      };

      dispatch(
        setCredentials({
          user: userData,
          accessToken: result.accessToken,
        })
      );

      /*await updateProfile({
        avatarUrl: result.avatarUrl,
      }).unwrap(); */

      router.navigate("/(tabs)/home");
      resetForm();
    } catch {}
  };

  return {
    // state
    showCodeModal,
    showErrorModal,
    errorMessage,
    isVerifying,
    // actions
    sendCodeIfNeeded,
    verifyCodeIfNeeded,
    handleResendCode,
    closeErrorModal,
    closeCodeModal,
    handleFinalSubmit,
  };
};

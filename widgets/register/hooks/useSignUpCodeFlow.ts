import { useSignUpInitMutation, useSignUpVerifyCodeMutation } from "@/api/authApi";
import { useCallback, useState } from "react";
import { useSignUpFormContext } from "./useSignUpFormContext";

export const useSignUpCodeFlow = () => {
  const { step, formData, setStep } = useSignUpFormContext();

  const [signUpInit] = useSignUpInitMutation();
  const [signUpVerifyCode, { isLoading: isVerifying }] =
    useSignUpVerifyCodeMutation();

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
    if (
      step === 2 &&
      formData.email &&
      formData.code &&
      !codeVerified
    ) {
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
  }, [codeVerified, formData.code, formData.email, setStep, signUpVerifyCode, step]);

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
  };
};



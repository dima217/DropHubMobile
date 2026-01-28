import {
    useResetPasswordConfirmMutation,
    useResetPasswordInitMutation,
} from "@/api/authApi";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useResetPasswordFormContext } from "./useResetPasswordFormContext";
  
  export const useResetPasswordFlow = () => {
    const { step, formData, setStep, resetForm } = useResetPasswordFormContext();
    const router = useRouter();
  
    const [resetPasswordInit] = useResetPasswordInitMutation();
    const [resetPasswordConfirm] = useResetPasswordConfirmMutation();
  
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showPasswordChangedModal, setShowPasswordChangedModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [codeSent, setCodeSent] = useState(false);
  
    const closeErrorModal = () => setShowErrorModal(false);
    const closeCodeModal = () => setShowCodeModal(false);
    const closePasswordChangedModal = () => setShowPasswordChangedModal(false);
    
    const sendCodeIfNeeded = useCallback(async () => {
      if (step === 1 && formData.email && !codeSent) {
        try {
          await resetPasswordInit({ email: formData.email }).unwrap();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [codeSent, formData.email, resetPasswordInit, step]);
  
    const confirmPassword = useCallback(async (passwordData?: { password?: string; confirm?: string }) => {
      const password = passwordData?.password || formData.password;
      
      if (formData.email && formData.code && password) {
        try {
          const result = await resetPasswordConfirm({
            email: formData.email,
            code: formData.code,
            newPassword: password,
          }).unwrap();
          if (result.success) {
            router.replace("/(auth)/login?showModal=passwordChanged");
            resetForm();
          } else {
            setErrorMessage("Failed to confirm password");
            setShowErrorModal(true);
          }
        } catch (error: any) {
          let errorMsg = "Failed to verify code";
  
          const data = error?.data;
          if (data?.message) {
            errorMsg = data.message;
          }
          setErrorMessage(errorMsg);
          setShowErrorModal(true);
        }
      } else {
        setErrorMessage("Email, code and password are required");
        setShowErrorModal(true);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.code, formData.email, formData.password, resetPasswordConfirm, router]);
  
    return {
      // state
      showCodeModal,
      showErrorModal,
      errorMessage,
      showPasswordChangedModal,
      // actions
      sendCodeIfNeeded,
      confirmPassword,
      closeErrorModal,
      closeCodeModal,
      closePasswordChangedModal,
    };
  };
  
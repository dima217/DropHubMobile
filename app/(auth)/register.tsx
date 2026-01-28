import Header from "@/shared/Header";
import ErrorModal from "@/shared/Modals/ErrorModal";
import VerificationCodeModal from "@/shared/Modals/VerificationCodeModal";
import AuthPrompt from "@/shared/ui/AuthPrompt";
import View from "@/shared/View";
import SignUpFormWrapper from "@/widgets/register/components/FormWrapper";
import { useSignUpCodeFlow } from "@/widgets/register/hooks/useSignUpCodeFlow";
import {
  SignUpFormProvider,
  useSignUpFormContext,
} from "@/widgets/register/hooks/useSignUpFormContext";
import AvatarScreen from "@/widgets/register/Screens/Avatar";
import EmailScreen from "@/widgets/register/Screens/Email";
import PasswordScreen from "@/widgets/register/Screens/Password";
import CodeScreen from "@/widgets/register/Screens/Verification";
import { signUpStepsConfig } from "@/widgets/register/validation/validationSchemas";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View as RNView, StyleSheet } from "react-native";

const SignUpContent = () => {
  const router = useRouter();

  const { step, setTotalSteps, formData, setStep } = useSignUpFormContext();

  const {
    showCodeModal,
    showErrorModal,
    errorMessage,
    sendCodeIfNeeded,
    verifyCodeIfNeeded,
    handleResendCode,
    closeCodeModal,
    closeErrorModal,
    handleFinalSubmit,
  } = useSignUpCodeFlow();

  useEffect(() => {
    setTotalSteps(4);
  }, [setTotalSteps]);

  useEffect(() => {
    sendCodeIfNeeded();
  }, [sendCodeIfNeeded, step, formData.email]);

  useEffect(() => {
    verifyCodeIfNeeded();
  }, [verifyCodeIfNeeded, step, formData.code]);

  const renderStepComponent = () => {
    switch (step) {
      case 0:
        return <EmailScreen />;
      case 1:
        return <CodeScreen />;
      case 2:
        return <PasswordScreen />;
      case 3:
        return <AvatarScreen />;
      default:
        return null;
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      if (router.canGoBack?.()) {
        router.back();
      } else {
        router.replace("/");
      }
    }
  };

  return (
    <View>
      <Header onBackPress={handleBack} />
      <RNView style={styles.container}>
        <SignUpFormWrapper
          key={step}
          onFinalSubmit={handleFinalSubmit}
          validationSchemas={signUpStepsConfig}
          buttonText={"Continue"}
        >
          {renderStepComponent()}
        </SignUpFormWrapper>

        <VerificationCodeModal
          isVisible={showCodeModal}
          email={formData.email || ""}
          onClose={closeCodeModal}
        />

        <ErrorModal
          isVisible={showErrorModal}
          message={errorMessage}
          onClose={closeErrorModal}
        />

        <RNView style={styles.innerContainer}>
          {step === 0 && (
            <AuthPrompt
              promptText="Already have an account?"
              actionText="Sign In"
              onPressAction={() => router.navigate("/(auth)/login")}
            />
          )}

          {step === 1 && (
            <AuthPrompt
              promptText="Didn't receive the code?"
              actionText="Request again"
              onPressAction={handleResendCode}
            />
          )}
        </RNView>
      </RNView>
    </View>
  );
};

const RegisterScreen: React.FC = () => {
  return (
    <SignUpFormProvider>
      <SignUpContent />
    </SignUpFormProvider>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "20%",
    alignItems: "center",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: "2%",
    gap: 10,
    width: "100%",
    alignItems: "center",
  },
});

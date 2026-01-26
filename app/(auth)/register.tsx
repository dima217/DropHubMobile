import Header from "@/shared/Header";
import AuthPrompt from "@/shared/ui/AuthPrompt";
import View from "@/shared/View";
import SignUpFormWrapper from "@/widgets/register/components/FormWrapper";
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
import React, { useEffect, useState } from "react";
import { View as RNView, StyleSheet } from "react-native";

const SignUpContent = () => {
  const router = useRouter();

  const { step, setTotalSteps, resetForm, formData, setStep } =
    useSignUpFormContext();

  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    setTotalSteps(4);
  }, [setTotalSteps]);

  const handleFinalSubmit = () => {};

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

  const handleResendCode = () => {
    console.log("Resend code");
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

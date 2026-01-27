import { useResetPasswordInitMutation } from "@/api/authApi";
import Header from "@/shared/Header";
import ErrorModal from "@/shared/Modals/ErrorModal";
import VerificationCodeModal from "@/shared/Modals/VerificationCodeModal";
import AuthPrompt from "@/shared/ui/AuthPrompt";
import View from "@/shared/View";
import ResetPasswordFormWrapper from "@/widgets/password/components/FormWrapper";
import { ResetPasswordFormProvider, useResetPasswordFormContext } from "@/widgets/password/hooks/useResetPasswordFormContext";
import ResetPasswordEmailScreen from "@/widgets/password/Screens/Email";
import NewPasswordScreen from "@/widgets/password/Screens/NewPassword";
import { resetPasswordStepsConfig } from "@/widgets/password/validation/validationSchemas";
import CodeScreen from "@/widgets/register/Screens/Verification";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View as RNView, StyleSheet } from "react-native";

const ResetPassword = () => {
    const { step, setTotalSteps, resetForm, formData, setStep } =
    useResetPasswordFormContext();
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [resetPasswordInit, { isLoading: isResetPasswordInitLoading }] = useResetPasswordInitMutation();

    useEffect(() => {
        setTotalSteps(3);
    }, [setTotalSteps]);

    const handleFinalSubmit = () => {};

    const renderStepComponent = () => {
        switch (step) {
            case 0:
                return <ResetPasswordEmailScreen />;
            case 1:
                return <CodeScreen />;
            case 2:
                return <NewPasswordScreen />;
            default:
                return null;
        }
    } 

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
    <Header onBackPress={handleBack}/>
        <RNView style={styles.container}>
            <ResetPasswordFormWrapper
                validationSchemas={resetPasswordStepsConfig}
                onFinalSubmit={handleFinalSubmit}
                buttonText="Continue"
                >
                {renderStepComponent()}
            </ResetPasswordFormWrapper>
        <VerificationCodeModal
          isVisible={showCodeModal}
          email={formData.email || ""}
          onClose={() => setShowCodeModal(false)}
        />

        <ErrorModal
          isVisible={showErrorModal}
          message={errorMessage}
          onClose={() => {
          setShowErrorModal(false);
        }}
        />
        </RNView>
        <RNView style={styles.innerContainer}>
          {step === 1 && (
            <AuthPrompt
              promptText="Didn't receive the code?"
              actionText="Request again"
              onPressAction={() => {}}
            />
          )}
        </RNView>
    </View>
) }

const ResetPasswordScreen = () => {
    return (
        <ResetPasswordFormProvider>
            <ResetPassword />
        </ResetPasswordFormProvider>
    )
}

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: "20%",
        alignItems: "center",
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
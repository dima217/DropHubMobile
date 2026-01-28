import Header from "@/shared/Header";
import ErrorModal from "@/shared/Modals/ErrorModal";
import PasswordChangedModal from "@/shared/Modals/PasswordChangedModal";
import VerificationCodeModal from "@/shared/Modals/VerificationCodeModal";
import AuthPrompt from "@/shared/ui/AuthPrompt";
import View from "@/shared/View";
import ResetPasswordFormWrapper, { ResetPasswordFormData } from "@/widgets/password/components/FormWrapper";
import { useResetPasswordFlow } from "@/widgets/password/hooks/useResetPasswordFlow";
import { ResetPasswordFormProvider, useResetPasswordFormContext } from "@/widgets/password/hooks/useResetPasswordFormContext";
import ResetPasswordEmailScreen from "@/widgets/password/Screens/Email";
import NewPasswordScreen from "@/widgets/password/Screens/NewPassword";
import { resetPasswordStepsConfig } from "@/widgets/password/validation/validationSchemas";
import CodeScreen from "@/widgets/register/Screens/Verification";
import { router } from "expo-router";
import { useEffect } from "react";
import { View as RNView, StyleSheet } from "react-native";

const ResetPassword = () => {
    const { step, setTotalSteps, formData, setStep } =
    useResetPasswordFormContext();

    useEffect(() => {
        setTotalSteps(3);
    }, [setTotalSteps]);

    const { 
      sendCodeIfNeeded, 
      confirmPassword, 
      closeErrorModal, 
      closeCodeModal, 
      closePasswordChangedModal, 
      errorMessage, 
      showPasswordChangedModal,
      showCodeModal,
      showErrorModal 
    } = useResetPasswordFlow();

    const handleFinalSubmit = (data: Partial<ResetPasswordFormData>) => {
      confirmPassword(data);
    };

    useEffect(() => {
      sendCodeIfNeeded();
    }, [sendCodeIfNeeded, formData.email]);  

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
          onClose={closeCodeModal}
        />

        <ErrorModal
          isVisible={showErrorModal}
          message={errorMessage}
          onClose={closeErrorModal}
        />
        <PasswordChangedModal
          isVisible={showPasswordChangedModal}
          onClose={closePasswordChangedModal}
        />
        </RNView>
        <RNView style={styles.innerContainer}>
          {step === 1 && (
            <AuthPrompt
              promptText="Didn't receive the code?"
              actionText="Request again"
              onPressAction={sendCodeIfNeeded}
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
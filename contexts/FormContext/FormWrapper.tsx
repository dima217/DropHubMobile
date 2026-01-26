import Button from "@/shared/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReactNode, useEffect, useMemo } from "react";
import {
  DefaultValues,
  FormProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { StyleSheet, ViewStyle } from "react-native";
import { AnyObjectSchema } from "yup";
import { useFormContext as useMultiStepFormContext } from "./FormContext";

interface StepConfig {
  schema: AnyObjectSchema;
  defaultValues?: DefaultValues<any>;
}

interface FormWrapperProps<T = Record<string, any>> {
  children: ReactNode;
  onFinalSubmit: (data: Partial<T>) => void;
  validationSchemas: StepConfig[];
  style?: ViewStyle;
  buttonText?: string;
}

type FormData = Record<string, any>;

const FormWrapper = <T extends Record<string, any>>({
  children,
  validationSchemas,
  onFinalSubmit,
  style,
  buttonText,
}: FormWrapperProps<T>) => {
  const context = useMultiStepFormContext<T>();

  if (!context) {
    throw new Error("FormWrapper must be used within FormProvider");
  }

  const { step, setStep, isLastStep, updateFormData, formData } = context;

  const currentStepConfig = useMemo(() => {
    return validationSchemas[step] || validationSchemas[0];
  }, [step, validationSchemas]);

  const initialValues = useMemo(() => {
    return {
      ...(currentStepConfig.defaultValues || {}),
      ...formData,
    };
  }, [currentStepConfig.defaultValues, formData]);

  const formMethods: UseFormReturn<FormData> = useForm<FormData>({
    resolver: yupResolver(currentStepConfig.schema),
    mode: "onSubmit",
  });

  useEffect(() => {
    formMethods.reset(initialValues, { keepErrors: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleSubmit = formMethods.handleSubmit((data: FormData) => {
    updateFormData(data as Partial<T>);

    if (!isLastStep) {
      setStep(step + 1);
    } else {
      const finalData = { ...formData, ...data };
      onFinalSubmit(finalData as Partial<T>);
    }
  });

  return (
    <FormProvider {...formMethods}>
      {children}
      <Button
        style={[styles.button, style]}
        onPress={handleSubmit}
        title={"Next"}
      />
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    width: "100%",
    flex: 1,
  },
  button: { marginTop: 24 },
});

export default FormWrapper;

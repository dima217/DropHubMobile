import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface FormContextType<T = Record<string, any>> {
  step: number;
  setStep: (step: number) => void;
  totalSteps: number;
  setTotalSteps: (step: number) => void;
  goToStep: (targetStep: number) => void;
  formData: Partial<T>;
  updateFormData: (patch: Partial<T>) => void;
  resetForm: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const FormContext = createContext<FormContextType<any> | undefined>(undefined);

interface FormProviderProps {
  children: React.ReactNode;
}

export function FormProvider<T = Record<string, any>>({
  children,
}: FormProviderProps) {
  const [step, setStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [formData, setFormData] = useState<Partial<T>>({} as Partial<T>);

  const goToStep = useCallback(
    (targetStep: number) => {
      if (targetStep >= 0 && targetStep < totalSteps) {
        setStep(targetStep);
      }
    },
    [totalSteps]
  );

  const updateFormData = useCallback((patch: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetForm = useCallback(() => {
    setStep(0);
    setFormData({} as Partial<T>);
  }, []);

  const contextValue = useMemo<FormContextType<T>>(
    () => ({
      step,
      setStep,
      totalSteps,
      setTotalSteps,
      goToStep,
      formData,
      updateFormData,
      resetForm,
      isFirstStep: step === 0,
      isLastStep: step === totalSteps - 1,
    }),
    [step, totalSteps, formData, goToStep, updateFormData, resetForm]
  );

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
}

export function useFormContext<T = Record<string, any>>(): FormContextType<T> {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context as FormContextType<T>;
}

import FormWrapper from "@/contexts/FormContext/FormWrapper";
import { DefaultValues } from "react-hook-form";
import { AnyObjectSchema } from "yup";

interface StepConfig {
  schema: AnyObjectSchema;
  defaultValues?: DefaultValues<any>;
}

export interface ResetPasswordFormData {
  email: string;
  code: string;
  password: string;
}

interface ResetPasswordFormWrapperProps {
  children: React.ReactNode;
  onFinalSubmit: (data: Partial<ResetPasswordFormData>) => void;
  validationSchemas: StepConfig[];
  style?: any;
  buttonText?: string;
}

const ResetPasswordFormWrapper = ({
  children,
  validationSchemas,
  onFinalSubmit,
  style,
  buttonText,
}: ResetPasswordFormWrapperProps) => {
  return (
    <FormWrapper<ResetPasswordFormData>
      validationSchemas={validationSchemas}
      onFinalSubmit={onFinalSubmit}
      style={style}
      buttonText={buttonText}
    >
      {children}
    </FormWrapper>
  );
};

export default ResetPasswordFormWrapper;

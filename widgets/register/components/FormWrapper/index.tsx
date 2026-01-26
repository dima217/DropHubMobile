import FormWrapper from "@/contexts/FormContext/FormWrapper";
import { DefaultValues } from "react-hook-form";
import { AnyObjectSchema } from "yup";

interface StepConfig {
  schema: AnyObjectSchema;
  defaultValues?: DefaultValues<any>;
}

export interface SignUpFormData {
  email: string;
  code: string;
  password: string;
  confirm: string;
  username: string;
  avatar: string;
}

interface SignUpFormWrapperProps {
  children: React.ReactNode;
  onFinalSubmit: (data: Partial<SignUpFormData>) => void;
  validationSchemas: StepConfig[];
  style?: any;
  buttonText?: string;
}

const SignUpFormWrapper = ({
  children,
  validationSchemas,
  onFinalSubmit,
  style,
  buttonText,
}: SignUpFormWrapperProps) => {
  return (
    <FormWrapper<SignUpFormData>
      validationSchemas={validationSchemas}
      onFinalSubmit={onFinalSubmit}
      style={style}
      buttonText={buttonText}
    >
      {children}
    </FormWrapper>
  );
};

export default SignUpFormWrapper;

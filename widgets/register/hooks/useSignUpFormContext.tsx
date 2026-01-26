import {
  FormProvider,
  useFormContext,
} from "@/contexts/FormContext/FormContext";
import { SignUpFormData } from "../components/FormWrapper";

export const SignUpFormProvider = FormProvider<SignUpFormData>;

export const useSignUpFormContext = () => useFormContext<SignUpFormData>();

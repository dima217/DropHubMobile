import {
  FormProvider,
  useFormContext,
} from "@/contexts/FormContext/FormContext";
import { ResetPasswordFormData } from "../components/FormWrapper";

export const ResetPasswordFormProvider = FormProvider<ResetPasswordFormData>;

export const useResetPasswordFormContext = () => useFormContext<ResetPasswordFormData>();

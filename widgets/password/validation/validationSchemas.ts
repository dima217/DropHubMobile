import * as yup from "yup";

export const emailSchema = yup.object({
  email: yup
    .string()
    .required("Email обязателен")
    .email("Введите корректный email адрес"),
});

export const codeSchema = yup.object({
  code: yup
    .string()
    .required("Код верификации обязателен")
    .length(6, "Код должен состоять из 6 цифр"),
});

export const passwordSchema = yup.object({
  password: yup
    .string()
    .required("Пароль обязателен")
    .min(8, "Пароль должен содержать минимум 8 символов")
    .max(50, "Пароль должен содержать максимум 50 символов"),
  confirm: yup
    .string()
    .required("Подтверждение пароля обязательно")
    .oneOf([yup.ref("password")], "Пароли не совпадают"),
});

export const resetPasswordStepsConfig = [
  {
    schema: emailSchema,
    defaultValues: {
      email: "",
    },
  },
  {
    schema: codeSchema,
    defaultValues: {
      code: "",
    },
  },
  {
    schema: passwordSchema,
    defaultValues: {
      password: "",
      confirm: "",
    },
  },
];

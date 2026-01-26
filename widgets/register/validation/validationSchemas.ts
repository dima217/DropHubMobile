import * as yup from "yup";

export const emailSchema = yup.object({
  email: yup
    .string()
    .required("Email обязателен")
    .email("Введите корректный email адрес"),
  username: yup
    .string()
    .required("Имя обязательно")
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(50, "Имя должно содержать максимум 50 символов"),
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

export const avatarSchema = yup.object({
  avatar: yup.string().required("Аватар должен быть выбран"),
});

export const signUpStepsConfig = [
  {
    schema: emailSchema,
    defaultValues: {
      email: "",
      username: "",
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
  {
    schema: avatarSchema,
    defaultValues: {
      avatar: "",
    },
  },
];

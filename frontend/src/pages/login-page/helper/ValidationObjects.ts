import * as Yup from "yup";

const validationShemaSignIn = Yup.object({
  username: Yup.string()
    .max(15, "Must be 15 characters or less")
    .required("Required"),
  password: Yup.string()
    .min(6, "Must be 6 characters or more")
    .required("Required"),
});

const validationShemaSignUp = Yup.object({
  username: Yup.string()
    .max(15, "Must be 15 characters or less")
    .required("Required"),
  password: Yup.string()
    .min(6, "Must be 6 characters or more")
    .required("Required"),
  displayName: Yup.string().min(4, "Must be 4 characters or more").required(),
});

export { validationShemaSignIn, validationShemaSignUp };

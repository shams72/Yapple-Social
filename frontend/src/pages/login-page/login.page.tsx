import { Formik, Form, Field, FormikHelpers } from "formik";
import { Error } from "./components";
import { validationShemaSignIn } from "./helper";
import { onSubmit } from "./event-handler";
import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toastContext, WebSocketContext } from "../../store";
import { useAuth } from "../../hooks";
import { Layout } from "./Layout";
import styles from "./login.module.css";
import { MyFormValues } from "./types";

// route for redirecting after login
const ROUTES = {
  EXPLORE_POSTS: "/explore-posts",
} as const;

// main login component that handles both sign in and sign up
export const Login: FC = () => {
  // toggle between sign up (true) and sign in (false)
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const { isTokenValid, token } = useAuth();
  const navigate = useNavigate();

  // if user is already logged in, redirect to explore posts
  useEffect(() => {
    if (isTokenValid(token!)) {
      navigate(ROUTES.EXPLORE_POSTS);
    }
  }, [isTokenValid, token, navigate]);

  return (
    <Layout>
      {/* app title */}
      <div className={styles.titleContainer}>
        <h1>Yapple</h1>
      </div>

      {/* main container that switches between sign up and sign in */}
      <div
        className={`${styles.container} ${
          isSignUpMode ? styles["right-panel-active"] : ""
        }`}
      >
        {/* sign up form */}
        <div className={`${styles["form-container"]} ${styles["sign-up-container"]}`}>
          {isSignUpMode && (
            <>
              <h1 className={styles.titleAuthMode} style={{ textAlign: 'center', width: '100%', marginTop: '4rem' }}>
                Sign up
              </h1>
              <AuthForm isSignUpMode={isSignUpMode} />
            </>
          )}
        </div>

        {/* sign in form */}
        <div
          className={`${styles["form-container"]} ${styles["sign-in-container"]}`}
          data-testid="sign-in-container"
        >
          {!isSignUpMode && (
            <>
              <h1 className={styles.titleAuthMode} style={{ textAlign: 'center', width: '100%', marginTop: '4rem' }}>
                Sign in
              </h1>
              <AuthForm isSignUpMode={isSignUpMode} />
            </>
          )}
        </div>

        {/* animated overlay for switching between modes */}
        <div className={styles["overlay-container"]}>
          <div className={styles.overlay}>
            {/* left panel - shown when in sign up mode */}
            <div className={`${styles["overlay-panel"]} ${styles["overlay-left"]}`}>
              <h1>Join Yapple</h1>
              <p>Create an account and start sharing your voice</p>
              <button
                className={styles.ghost}
                onClick={() => setIsSignUpMode(false)}
              >
                Sign In
              </button>
            </div>
            {/* right panel - shown when in sign in mode */}
            <div className={`${styles["overlay-panel"]} ${styles["overlay-right"]}`}>
              <h1>Welcome Back!</h1>
              <p>Log in to continue sharing your thoughts with the community</p>
              <button
                className={styles.ghost}
                onClick={() => setIsSignUpMode(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// props for the auth form component
interface AuthFormProps {
  isSignUpMode: boolean;
}

// form component used for both sign in and sign up
const AuthForm: FC<AuthFormProps> = ({ isSignUpMode }) => {
  // default empty values for the form
  const initialValues: MyFormValues = {
    username: "",
    password: "",
    displayName: "",
  };

  const { setOpen } = useContext(toastContext);
  const { websocket } = useContext(WebSocketContext);
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationShemaSignIn}
      onSubmit={(values: MyFormValues, formikHelpers: FormikHelpers<MyFormValues>) => {
        return onSubmit(values, formikHelpers, setOpen, navigate, isSignUpMode, websocket);
      }}
    >
      {({ errors, touched }) => (
        <Form>
          {/* display name input - only shown during sign up */}
          {isSignUpMode && (
            <>
              <Field
                id="displayName"
                name="displayName"
                placeholder="Enter display name"
                className={styles.inputField}
              />
              <Error
                errorMessage={errors.displayName}
                isErrorFieldTouched={touched.displayName}
              />
            </>
          )}

          {/* username input */}
          <Field
            id="username"
            name="username"
            placeholder="Enter username"
            className={styles.inputField}
          />
          <Error
            errorMessage={errors.username}
            isErrorFieldTouched={touched.username}
          />

          {/* password input */}
          <Field
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            className={styles.inputField}
          />
          <Error
            errorMessage={errors.password}
            isErrorFieldTouched={touched.password}
          />

          <button type="submit">
            {isSignUpMode ? "Sign Up" : "Sign In"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

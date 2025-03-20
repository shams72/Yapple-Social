import { FC } from "react";

interface ErrorProps {
  errorMessage: string | undefined;
  isErrorFieldTouched: boolean | undefined;
}

export const Error: FC<ErrorProps> = ({
  errorMessage,
  isErrorFieldTouched,
}) => {
  return (
    errorMessage &&
    isErrorFieldTouched && (
      <div style={{ color: "red", fontSize: "0.8em" }}>{errorMessage}</div>
    )
  );
};

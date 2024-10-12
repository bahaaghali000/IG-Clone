import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import { useTranslation } from "react-i18next";
import useSignup from "../hooks/useSignup";
import Helmet from "../components/Common/Helmet";
import InputField from "../components/UI/Input/InputField";
import Button from "../components/UI/Button/Button";
import Box from "../components/UI/Box/Box";

const Signup = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const { t } = useTranslation();

  const { loading, signup } = useSignup();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signup({ username, email, fullname, password });
  };

  return (
    <Helmet title="Signup • instagram">
      <div className=" absolute bg-white text-black left-1/2 top-1/2 -translate-x-1/2  -translate-y-1/2 min-h-screen w-full flex flex-col items-center justify-center ">
        <div className=" w-96">
          <Box className="px-10 py-12 mb-4">
            <div className=" text-center mb-2">
              <span
                aria-label="Instagram"
                className="logo text-center"
                role="img"
              ></span>
            </div>
            <p className="text-center text-gray-500 font-semibold">
              {t("signup.signupDesc")}
            </p>

            <form className="mt-10" onSubmit={handleSubmit}>
              <InputField
                inputValue={email}
                setInputValue={setEmail}
                label={t("signup.emailInput")}
                type="email"
              />

              <InputField
                inputValue={fullname}
                setInputValue={setFullname}
                label={t("signup.fullnameInput")}
              />

              <InputField
                inputValue={username}
                setInputValue={setUsername}
                label={t("signup.usernameInput")}
              />

              <InputField
                inputValue={password}
                setInputValue={setPassword}
                label={t("signup.passwordInput")}
                isPassword={true}
              />

              <Button loading={loading} disabled={isEnabled} className="w-full">
                {t("signup.submitBtn")}
              </Button>
            </form>
          </Box>

          <Box className="p-5">
            <h3 className="text-center">
              {t("signup.loginLine")}
              {"  "}
              <Link
                className="text-blue-500 font-semibold"
                to="/accounts/login"
              >
                {t("signup.loginButton")}
              </Link>
            </h3>
          </Box>
        </div>

        <div className=" absolute bottom-10">
          <Footer />
        </div>
      </div>
    </Helmet>
  );
};

export default Signup;

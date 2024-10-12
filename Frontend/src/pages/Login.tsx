import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import { useTranslation } from "react-i18next";
import useLogin from "../hooks/useLogin";
import Helmet from "../components/Common/Helmet";
import Button from "../components/UI/Button/Button";
import InputField from "../components/UI/Input/InputField";
import Box from "../components/UI/Box/Box";
// import Helmet from "../components/Common/"

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const { t } = useTranslation();

  const [loading, login] = useLogin();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    await login({ username, password });
  };

  useEffect(() => {
    if (username.length > 2 && password.length >= 6) {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  }, [username, password]);

  return (
    <Helmet title="Login • instagram">
      <div className=" absolute bg-white text-black left-1/2 top-1/2 -translate-x-1/2  -translate-y-1/2 min-h-screen w-full flex flex-col items-center justify-center ">
        <div className=" w-96">
          <Box className=" px-10 py-12 mb-4">
            <div className=" text-center mb-2">
              <span
                aria-label="Instagram"
                className="logo text-center"
                role="img"
              ></span>
            </div>

            <form className="mt-10" onSubmit={handleSubmit}>
              <InputField
                inputValue={username}
                setInputValue={setUsername}
                label={t("login.usernameInput")}
              />

              <InputField
                inputValue={password}
                setInputValue={setPassword}
                label={t("login.passwordInput")}
                isPassword={true}
              />

              <Button loading={loading} disabled={!isEnabled} className="w-full">
                {t("login.submitBtn")}
              </Button>
            </form>

            <div className=" mt-5 flex justify-center items-center gap-2">
              <span className=" inline-block h-[1px] rounded-md w-full bg-[#737373]"></span>
              <span className=" font-semibold text-[#737373]">
                {t("forgotPassword.or")}
              </span>
              <span className=" inline-block h-[1px] rounded-md w-full bg-[#737373]"></span>
            </div>

            <div className="text-center mt-3">
              <Link
                to="/accounts/forgot-password"
                className=" text-center text-blue-500 text-sm font-medium"
              >
                {t("login.forgotPassword")}
              </Link>
            </div>
          </Box>

          <Box className="p-5 text-center mt-5">
            <h3 className="text-center">
              {t("login.signline")}{" "}
              <Link
                className="text-blue-500 font-semibold"
                to="/accounts/signup"
              >
                {t("login.signupButton")}
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

export default Login;

// For Referance
/*
  <div className="form__input">
                <label
                  htmlFor="username"
                  className={`form__label ${username ? "top-0 text-xs" : ""}`}
                >
                  {t("login.usernameInput")}
                </label>
                <input
                  id="username"
                  type="text"
                  className=" w-full outline-none text-xs"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  required
                />
              </div> 


<div className="border w-full p-2 rounded relative focus:border-gray-500">
                <label
                  htmlFor="passowrd"
                  className={`text-gray-500 text-sm absolute transition-all ${
                    password ? "top-0 text-xs" : ""
                  }`}
                >
                  {t("login.passwordInput")}
                </label>
                <input
                  id="passowrd"
                  type={showPassword ? "text" : "password"}
                  className=" w-full outline-none text-xs"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  minLength={6}
                  required
                />

                {password && (
                  <span
                    className=" absolute right-3 font-semibold select-none cursor-pointer hover:text-gray-600 "
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                )}
              </div>

              <button className="submit__btn" type="submit">
                {loading ? (
                  <div className=" flex justify-center items-center py-0.5">
                    <span className="loader"></span>
                  </div>
                ) : (
                  t("login.submitBtn")
                )}
              </button>  
*/

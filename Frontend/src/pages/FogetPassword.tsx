/* eslint-disable @typescript-eslint/no-explicit-any */
import { CiLock } from "react-icons/ci";
import Helmet from "../components/Common/Helmet";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Box from "../components/UI/Box/Box";
import Footer from "../components/Footer/Footer";
import InputField from "../components/UI/Input/InputField";
import Button from "../components/UI/Button/Button";

const FogetPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { t } = useTranslation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);
    try {
      const { data } = await axios.post("/auth/forgot-password", {
        email,
      });

      if (data.success) {
        toast.success(data.message);
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  }, [email]);

  //   We sent an email to bahaaghali000@icloud.com with a link to get back into your account.
  return (
    <Helmet title="Reset Password">
      <div className="absolute bg-white text-black left-1/2 top-1/2 -translate-x-1/2  -translate-y-1/2  min-h-screen w-full flex flex-col items-center justify-center ">
        <div className=" w-96 ">
          <Box className=" px-10 py-12 mb-4">
            <div className="py-4 flex flex-col items-center gap-2 justify-center w-full">
              <div className=" text-2xl border w-max p-4 rounded-full  border-black">
                <CiLock className=" text-4xl" />
              </div>

              <h2 className=" font-semibold">{t("forgotPassword.title")}</h2>
              <p className="text__description px-4">
                {t("forgotPassword.description")}
              </p>
            </div>

            <form className="mt-10" onSubmit={handleSubmit}>
              <InputField
                inputValue={email}
                setInputValue={setEmail}
                label={t("forgotPassword.inputPlaceholder")}
                type="email"
              />

              <Button loading={loading} disabled={!isEnabled}>
                {t("forgotPassword.submitBtn")}
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
                to="/accounts/signup"
                className=" text-center font-semibold hover:text-[#737373]"
              >
                {t("forgotPassword.createNewAccount")}
              </Link>
            </div>
          </Box>

          <Box className="p-5 text-center mt-5 ">
            <Link
              to="/accounts/login"
              className=" text-center font-semibold hover:text-[#737373]"
            >
              {t("forgotPassword.returnToLogin")}
            </Link>
          </Box>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <Footer />
          </div>
        </div>
      </div>
    </Helmet>
  );
};

export default FogetPassword;

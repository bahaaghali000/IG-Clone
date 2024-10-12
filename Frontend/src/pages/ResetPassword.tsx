import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Helmet from "../components/Common/Helmet";
import axios from "axios";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setUserInfo } from "../redux/features/userSlice";
import InputField from "../components/UI/Input/InputField";
import Button from "../components/UI/Button/Button";
import Box from "../components/UI/Box/Box";
import Footer from "../components/Footer/Footer";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [repassword, setRepassword] = useState<string>("");
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState({
    isLargerThen6: false,
    isMatch: false,
  });

  const { restToken } = useParams();

  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await axios.patch(`/auth/rest-password/${restToken}`, {
        password,
      });

      dispatch(setUserInfo(data.data));
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (password.length >= 6) {
      setShowFeedback((prev) => ({ ...prev, isLargerThen6: true }));

      setShowFeedback({
        isLargerThen6: true,
        isMatch: password === repassword,
      });
      setIsEnabled(password === repassword);
    } else {
      setShowFeedback({ isLargerThen6: false, isMatch: false });
    }
  }, [password, repassword]);

  return (
    <Helmet title="Reset Password">
      <div className="absolute bg-white text-black left-1/2 top-1/2 -translate-x-1/2  -translate-y-1/2  min-h-screen w-full flex flex-col items-center justify-center ">
        <div className=" w-96">
          <Box className="px-10 py-12">
            <div className="text-center px-3 mb-4">
              <h2 className=" font-semibold">Create A Strong Password</h2>
              <p className="text__description text-center">
                Your password must be at least 6 characters and should include a
                combination of numbers, letters and special characters (!$@%).
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {password && !showFeedback.isLargerThen6 && (
                <p className="text__description py-1">
                  Passwords must be at least 6 characters.
                </p>
              )}

              <InputField
                inputValue={password}
                setInputValue={setPassword}
                label={"New password"}
                isPassword={true}
              />

              {repassword &&
                showFeedback.isLargerThen6 &&
                !showFeedback.isMatch && (
                  <p className="text__description py-1">
                    Passwords don't match
                  </p>
                )}
              <InputField
                inputValue={repassword}
                setInputValue={setRepassword}
                label={" Re-enter new password"}
                isPassword={true}
              />

              <Button loading={loading} disabled={!isEnabled}>
                {"Reset Password"}
              </Button>
            </form>

            <div className=" absolute bottom-10">
              <Footer />
            </div>
          </Box>
        </div>
      </div>{" "}
    </Helmet>
  );
};

export default ResetPassword;

import React from "react";
import Helmet from "../components/Common/Helmet";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Link } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Button from "../components/UI/Button/Button";

const NotFound: React.FC = () => {
  const { isAuthenticited } = useSelector((state: RootState) => state.user);

  return (
    <Helmet title={`Page Not Found . Instagram`}>
      {isAuthenticited && (
        <div className="flex flex-col justify-between">
          <div className="p-10 text-center">
            <h2 className=" text-2xl font-semibold">
              Sorry, this page isn't available.
            </h2>
            <p className=" mt-5">
              {" "}
              The link you followed may be broken, or the page may have been
              removed.{" "}
              <Link to="/" className="link">
                Go back to Instagram.
              </Link>
            </p>
          </div>

          <div className=" text-center ">
            <Footer />
          </div>
        </div>
      )}
      {!isAuthenticited && (
        <div className="fixed top-0 left-0 min-h-screen w-full bg-white">
          <div className=" container mx-auto border-b px-10 flex justify-between items-center">
            <Link to="/">
              <span
                aria-label="Instagram"
                className=" sidebar__logo mt-5"
                role="img"
              ></span>
            </Link>

            <div className="flex gap-2 items-center">
              <Link to="/accounts/login">
                <Button>Log In</Button>
              </Link>
              <Link to="/accounts/signup" className="link  font-semibold">
                Sign Up
              </Link>
            </div>
          </div>
          <div className="p-10 text-center container mx-auto">
            <h2 className=" text-2xl font-semibold">
              Sorry, this page isn't available.
            </h2>
            <p className=" mt-5">
              {" "}
              The link you followed may be broken, or the page may have been
              removed.{" "}
              <Link to="/" className="link">
                Go back to Instagram.
              </Link>
            </p>
          </div>
        </div>
      )}
    </Helmet>
  );
};

export default NotFound;

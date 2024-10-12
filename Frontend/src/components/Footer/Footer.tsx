import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setLng } from "../../redux/features/userSlice";

const Footer = () => {
  const { i18n } = useTranslation();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLng());
  }, [i18n.language, dispatch]);

  return (
    <div className=" w-full text-xs">
      <select
        className="mr-4 outline-none dark:bg-transparent"
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        value={i18n.language}
      >
        <option value="en" className=" dark:bg-black">English</option>
        <option value="ar" className=" dark:bg-black">العربية</option>
      </select>

      <span>
        © {new Date().getFullYear()} BgGram From{" "}
        <a
          className="text-blue-500 font-semibold"
          target="_blank"
          href="https://bahaaghali000.vercel.app"
        >
          bahaaghali000
        </a>
      </span>
    </div>
  );
};

export default Footer;

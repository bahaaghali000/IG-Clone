import React, { ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

interface Props {
  inputValue: string;
  setInputValue: (e: any) => void;
  label: string;
  type?: string;
  isPassword?: boolean;
}

const InputField: React.FC<Props> = ({
  inputValue,
  setInputValue,
  label,
  isPassword = false,
  type = "text",
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { lng } = useSelector((state: RootState) => state.user);

  if (isPassword)
    return (
      <div className="form__input">
        <label
          htmlFor="passowrd"
          className={`text-gray-500 z-0 select-none text-sm absolute transition-all ${
            inputValue ? "top-0 text-xs" : ""
          }`}
        >
          {label}
        </label>
        <input
          id="passowrd"
          type={showPassword ? "text" : "password"}
          className=" w-full outline-none text-xs z-10 ltr"
          onChange={(e: any) => setInputValue(e.target.value)}
          value={inputValue}
          minLength={6}
          required
        />

        {inputValue && (
          <span
            className={`absolute  right-3 font-semibold select-none cursor-pointer hover:text-gray-600 `}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword
              ? lng === "ar"
                ? "اخفاء"
                : "Hide"
              : lng === "ar"
              ? "اظهر"
              : "Show"}
          </span>
        )}
      </div>
    );

  if (!isPassword)
    return (
      <div className="form__input">
        <label
          htmlFor={label}
          className={`form__label ltr ${inputValue ? "top-0 text-xs" : ""}`}
        >
          {label}
        </label>
        <input
          id={label}
          type={type}
          className=" w-full outline-none text-xs ltr "
          onChange={(e: any) => setInputValue(e.target.value)}
          value={inputValue}
          required
        />
      </div>
    );
};

export default InputField;

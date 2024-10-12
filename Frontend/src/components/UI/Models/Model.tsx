import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  showModel: boolean;
  children: React.ReactNode;
  setShowModel: (showModel: boolean) => void;
}

const Model: React.FC<Props> = ({ showModel, children, setShowModel }) => {
  useEffect(() => {
    const handleClickOutside = () => {
      setShowModel(false);
      document.querySelector("#root").classList.remove("opacity-20");
    };
    if (showModel) {
      document.querySelector("#root").classList.add("opacity-20");
    } else {
    }
    document
      .querySelector("#root")
      .addEventListener("click", handleClickOutside);

    return () => {
      document
        .querySelector("#root")
        .removeEventListener("click", handleClickOutside);
    };
  }, [showModel, setShowModel]);

  return createPortal(
    <>
      <div className=" w-[550px] shadow-2xl transition-all dark:text-white pb-5 bg-[#262626] rounded-2xl z-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <div className="text-center py-4 border-b border-white border-opacity-25">
          <h3 className=" font-semibold">New message</h3>
        </div>

        <div className=" px-4 border-b flex gap-3 items-center border-white border-opacity-25">
          <h2 className="font-semibold">To:</h2>
          <input
            className=" bg-transparent w-full outline-none placeholder:text-white py-2 placeholder:opacity-35"
            placeholder="Search..."
            type="text"
          />
        </div>

        <div className=" h-[400px]"></div>
      </div>
    </>,
    document.body
  );
};

export default Model;

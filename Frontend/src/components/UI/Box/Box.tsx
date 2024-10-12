import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Box: React.FC<Props> = ({ children, className = "" }) => {
  return (
    <div
      className={`border border-black border-opacity-20 ${className}`}
    >
      {children}
    </div>
  );
};

export default Box;

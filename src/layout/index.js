import React from "react";
import logo from "../assets/logo.png";
export const AuthLayouts = ({ children }) => {
  return (
    <>
      <header className="bg-white flex justify-center items-center py-3 h-20 shadow-md">
        <img src={logo} alt="logo" width={180} height={60} />
      </header>
      {children}
    </>
  );
};

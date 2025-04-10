import React from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
export const AuthLayouts = ({ children }) => {
  const navigate = useNavigate();
  return (
    <>
      <header className="bg-white flex justify-center items-center py-3 h-20 shadow-md">
        <img
          onClick={() => navigate("/")}
          src={logo}
          alt="logo"
          width={180}
          height={60}
        />
      </header>
      {children}
    </>
  );
};

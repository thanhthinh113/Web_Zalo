import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import firebase from "../firebase"; // giống file RegisterPage
import { TbUserCircle } from "react-icons/tb";

function ForgotPasswordPage() {
  const [step, setStep] = useState("checkPhone");
  const [data, setData] = useState({ phone: "", newPassword: "" });
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible", defaultCountry: "VN" }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    const phone = data.phone.startsWith("+84")
      ? data.phone
      : data.phone.replace(/^0/, "+84");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/phone`,
        { phone: data.phone }
      );

      if (res.data.success) {
        setToken(res.data.token); // lưu token reset mật khẩu
        const appVerifier = window.recaptchaVerifier;
        const confirmationResult = await firebase
          .auth()
          .signInWithPhoneNumber(phone, appVerifier);
        window.confirmationResult = confirmationResult;
        setStep("verifyOtp");
        toast.success("OTP sent to your phone");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Phone check failed");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await window.confirmationResult.confirm(otp);
      toast.success("Phone verified ✅");
      setStep("resetPassword");
    } catch (err) {
      toast.error("Invalid OTP ❌");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/reset-password`,
        {
          newPassword: data.newPassword,
          token,
        }
      );
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white max-w-md mx-auto rounded p-4">
        <div className="w-fit mx-auto mb-2">
          <TbUserCircle size={80} />
        </div>
        <h3 className="text-center text-xl font-bold mb-4">Forgot Password</h3>

        {step === "checkPhone" && (
          <form onSubmit={handlePhoneSubmit} className="grid gap-4">
            <label className="text-sm font-medium">
              Phone:
              <input
                type="text"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === "verifyOtp" && (
          <form onSubmit={handleVerifyOtp} className="grid gap-4">
            <label className="text-sm font-medium">
              Enter OTP:
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Verify
            </button>
          </form>
        )}

        {step === "resetPassword" && (
          <form onSubmit={handlePasswordSubmit} className="grid gap-4">
            <label className="text-sm font-medium">
              New Password:
              <input
                type="password"
                name="newPassword"
                value={data.newPassword}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Reset Password
            </button>
          </form>
        )}

        <p className="text-center mt-4">
          New user?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default ForgotPasswordPage;

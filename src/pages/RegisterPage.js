import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";
import firebase from "../firebase";

function RegisterPage() {
  const [data, setData] = useState({
    name: "",
    phone: "",
    password: "",
    profile_pic: "",
  });
  const [uploadPhoto, setUploadPhoto] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        defaultCountry: "VN",
      }
    );
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setUploadPhoto(file);
    setData((prev) => ({
      ...prev,
      profile_pic: uploadPhoto?.url,
    }));
  };

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
  };

  const handleSendOTP = async () => {
    const appVerifier = window.recaptchaVerifier;
    const phone = data.phone.startsWith("+84")
      ? data.phone
      : data.phone.replace(/^0/, "+84");

    try {
      const confirmationResult = await firebase
        .auth()
        .signInWithPhoneNumber(phone, appVerifier);
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await window.confirmationResult.confirm(otp);
      toast.success("Phone verified ✅");
      setIsPhoneVerified(true);
    } catch (error) {
      console.log(error);
      toast.error("Invalid OTP ❌");
    }
  };

  const handleSubmit = async () => {
    const URL = `${process.env.REACT_APP_BACKEND}/api/register`;
    try {
      const response = await axios.post(URL, data);
      toast.success(response.data.message);
      if (response.data.success) {
        setData({
          name: "",
          phone: "",
          password: "",
          profile_pic: "",
        });
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
      console.log("error", error);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h3>Welcome to Chat app!</h3>
        <form className="grid gap-4 mt-5" onSubmit={(e) => e.preventDefault()}>
          {!isPhoneVerified && (
            <>
              <div className="flex flex-col gap-1">
                <label htmlFor="phone">Phone :</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone"
                  className="bg-slate-100 px-2 py-1 focus:outline-primary"
                  value={data.phone}
                  onChange={handleOnChange}
                  required
                />
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="bg-green-600 px-3 py-1 rounded text-white"
                >
                  Send OTP
                </button>
              </div>

              {otpSent && (
                <div className="flex flex-col gap-1">
                  <label>Enter OTP :</label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-slate-100 px-2 py-1 focus:outline-primary"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    className="bg-green-600 px-3 py-1 rounded text-white"
                  >
                    Verify OTP
                  </button>
                </div>
              )}
            </>
          )}

          {isPhoneVerified && (
            <>
              <div className="flex flex-col gap-1">
                <label htmlFor="name">Name :</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  className="bg-slate-100 px-2 py-1 focus:outline-primary"
                  value={data.name}
                  onChange={handleOnChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="password">Password :</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="bg-slate-100 px-2 py-1 focus:outline-primary"
                  value={data.password}
                  onChange={handleOnChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="profile_pic">
                  Photo :
                  <div className="h-14 bg-slate-200 flex justify-center items-center border hover:border-primary cursor-pointer">
                    <p className="text-sm max-w-[300] flex text-ellipsis line-clamp-1">
                      {uploadPhoto?.name
                        ? uploadPhoto?.name
                        : "Upload profile photo"}
                      {uploadPhoto?.name && (
                        <button
                          className="text-lg ml-2 hover:text-red-600"
                          onClick={handleClearUploadPhoto}
                        >
                          <IoClose />
                        </button>
                      )}
                    </p>
                  </div>
                </label>
                <input
                  type="file"
                  id="profile_pic"
                  name="profile_pic"
                  className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
                  onChange={handleUploadPhoto}
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 px-3 py-2 text-white rounded"
              >
                Register
              </button>
            </>
          )}
        </form>
        <p className="my-3 text-center">
          Already have an account?{" "}
          <Link
            onClick={() => navigate("/login")}
            className="hover:text-primary font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default RegisterPage;

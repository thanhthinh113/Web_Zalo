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
      <div className="bg-white max-w-md mx-auto rounded p-4">
        <h3 className="text-center text-xl font-bold mb-4">Register</h3>

        <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
          {!isPhoneVerified && (
            <>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone"
                  className="w-full px-3 py-2 border rounded focus:outline-blue-500 bg-gray-100"
                  value={data.phone}
                  onChange={handleOnChange}
                  required
                />
              </label>
              <button
                type="button"
                onClick={handleSendOTP}
                className="bg-blue-600 text-white rounded py-2"
              >
                Send OTP
              </button>

              {otpSent && (
                <>
                  <label>
                    Enter OTP:
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      className="w-full px-3 py-2 border rounded focus:outline-blue-500 bg-gray-100"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    className="bg-blue-600 text-white rounded py-2"
                  >
                    Verify OTP
                  </button>
                </>
              )}
            </>
          )}

          {isPhoneVerified && (
            <>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border rounded focus:outline-blue-500 bg-gray-100"
                  value={data.name}
                  onChange={handleOnChange}
                  required
                />
              </label>

              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border rounded focus:outline-blue-500 bg-gray-100"
                  value={data.password}
                  onChange={handleOnChange}
                  required
                />
              </label>

              <label>
                Photo:
                <div className="w-full h-14 px-3 py-2 bg-gray-200 border rounded flex items-center justify-between cursor-pointer hover:border-blue-500">
                  <span className="truncate">
                    {uploadPhoto?.name || "Upload profile photo"}
                  </span>
                  {uploadPhoto?.name && (
                    <button
                      className="text-xl hover:text-red-600"
                      onClick={handleClearUploadPhoto}
                    >
                      <IoClose />
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  id="profile_pic"
                  name="profile_pic"
                  className="hidden"
                  onChange={handleUploadPhoto}
                />
              </label>

              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 text-white rounded py-2"
              >
                Register
              </button>
            </>
          )}
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default RegisterPage;

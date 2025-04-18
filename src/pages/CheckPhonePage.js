import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { TbUserCircle } from "react-icons/tb";

function CheckPhonePage() {
  const [data, setData] = useState({
    phone: "",
  });
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${process.env.REACT_APP_BACKEND}/api/phone`;
    try {
      const response = await axios.post(URL, data);
      console.log("response", response);
      toast.success(response.data.message);
      if (response.data.success) {
        setData({
          phone: "",
        });
        navigate("/password", {
          state: response?.data?.data,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log("error", error);
    }
    console.log(data);
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2">
          <TbUserCircle size={80} />
        </div>
        <h3>Welcome to Chat app!</h3>
        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="phone">Phone Number :</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.phone}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
            Let's Go
          </button>
        </form>
        <p className="my-3 text-center">
          New User ?
          <Link to={"/register"} className="hover:text-primary font-semibold">
            Register
          </Link>{" "}
        </p>
      </div>
    </div>
  );
}

export default CheckPhonePage;

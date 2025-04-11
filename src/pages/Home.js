import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout, setUser } from "../redux/userSlice";
import { Sidebar } from "../components/Sidebar";

function Home() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND}/api/user-details`;
      const token = localStorage.getItem("token");

      const response = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/phone");
      }

      console.log("current user details", response.data.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const basePath = location.pathname === "/";
  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      {/* Message component */}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div className="lg:flex justify-center items-center flex-col gap-2 hidden">
        <h1 className="text-2xl font-bold text-slate-500">Zalo App</h1>
      </div>
    </div>
  );
}

export default Home;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  phone: "",
  profile_pic: "",
  token: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.phone = action.payload.phone;
      state.profile_pic = action.payload.profile_pic;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state, action) => {
      state._id = "";
      state.name = "";
      state.phone = "";
      state.profile_pic = "";
      state.token = "";
    },
  },
});

export const { setUser, setToken, logout } = userSlice.actions;

export default userSlice.reducer;

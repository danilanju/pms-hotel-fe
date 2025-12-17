import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";

// Aksi Async: Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/login", userData);
      // Backend Anda mengembalikan data di: response.data.data
      const { token, ...user } = response.data.data;

      // Simpan token di localStorage agar tidak hilang saat refresh
      localStorage.setItem("token", token);

      localStorage.setItem("user", JSON.stringify(user)); // Simpan data user sebagai string

      return { token, user };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Aksi Async: Logout
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  // Opsional: Panggil endpoint logout backend jika perlu
  // await axiosInstance.post('/auth/logout');
});

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Ambil kembali saat aplikasi load
  token: localStorage.getItem("token") || null,
  isLoading: false,
  isError: false,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";

// 1. Get All Rooms
export const getRooms = createAsyncThunk(
  "rooms/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/rooms");
      return response.data.data; // Sesuaikan dengan struktur JSON backend
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// 2. Create Room
export const createRoom = createAsyncThunk(
  "rooms/create",
  async (roomData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/rooms", roomData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// 3. Update Room
export const updateRoom = createAsyncThunk(
  "rooms/update",
  async ({ id, roomData }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/rooms/${id}`, roomData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// 4. Delete Room
export const deleteRoom = createAsyncThunk(
  "rooms/delete",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/rooms/${id}`);
      return id; // Return ID yang dihapus untuk update state lokal
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const roomSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    isLoading: false,
    isError: false,
    message: "",
  },
  reducers: {
    resetRoomState: (state) => {
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Rooms
      .addCase(getRooms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rooms = action.payload;
      })
      .addCase(getRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create Room
      .addCase(createRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rooms.push(action.payload); // Tambah data baru ke list
      })
      // Update Room
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.rooms.findIndex(
          (room) => room._id === action.payload._id
        );
        if (index !== -1) {
          state.rooms[index] = action.payload; // Update data di list
        }
      })
      // Delete Room
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rooms = state.rooms.filter((room) => room._id !== action.payload);
      });
  },
});

export const { resetRoomState } = roomSlice.actions;
export default roomSlice.reducer;

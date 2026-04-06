import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import API from "../../api/axios";

// Google Sign-In thunk
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (_, { rejectWithValue }) => {
    try {
      if (!auth || !googleProvider) {
        return rejectWithValue("Firebase is not configured. Please add Firebase credentials to .env file.");
      }
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await API.post("/api/auth/google", { idToken });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Login failed");
    }
  }
);

// Register User thunk
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/auth/register", userData);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Registration failed");
    }
  }
);

// Login User thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/auth/login", userData);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Login failed");
    }
  }
);

// Fetch current user thunk
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/api/auth/me");
      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      return rejectWithValue(error.response?.data?.message || "Session expired");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
    updateCredits: (state, action) => {
      if (state.user) {
        state.user.credits = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Email/Password Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Email/Password Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, updateCredits } = authSlice.actions;
export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const base_url = "http://localhost:5000/api/candidates";

// Thunks
export const fetchCandidates = createAsyncThunk(
  "candidates/fetch",
  async (_, thunkAPI) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("No token available");

      const response = await axios.get(`${base_url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      handleTokenError(error, thunkAPI);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error fetching candidates"
      );
    }
  }
);

export const createCandidate = createAsyncThunk(
  "candidates/create",
  async (candidateData, thunkAPI) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("No token available");

      const formData = new FormData();
      formData.append("name", candidateData.name);
      formData.append("jobTitle", candidateData.jobTitle);
      formData.append("email", candidateData.email);
      formData.append("phoneNumber", candidateData.phoneNumber);
      formData.append("state", candidateData.state);
      if (candidateData.resume) {
        formData.append("resume", candidateData.resume);
      }

      const response = await axios.post(`${base_url}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      handleTokenError(error, thunkAPI);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error creating candidate"
      );
    }
  }
);

export const updateCandidate = createAsyncThunk(
  "candidates/update",
  async ({ id, candidateData }, thunkAPI) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("No token available");

      const response = await axios.put(`${base_url}/${id}`, candidateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      thunkAPI.dispatch(fetchCandidates());
      return response.data;
    } catch (error) {
      handleTokenError(error, thunkAPI);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error updating candidate"
      );
    }
  }
);

export const deleteCandidate = createAsyncThunk(
  "candidates/delete",
  async (id, thunkAPI) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("No token available");

      await axios.delete(`${base_url}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      thunkAPI.dispatch(fetchCandidates());
      return { id };
    } catch (error) {
      handleTokenError(error, thunkAPI);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error deleting candidate"
      );
    }
  }
);

// Token Handling
const handleTokenError = (error, thunkAPI) => {
  if (error.response?.status === 401) {
    // Token expired or unauthorized
    toast.error("Session expired. Please log in again.");
    Cookies.remove("accessToken");
    localStorage.removeItem("accessToken");
    window.location.href = "/"; // Redirect to login
  }
};

// Slice
const candidateSlice = createSlice({
  name: "candidates",
  initialState: {
    candidates: [],
    isLoading: false,
    isError: false,
    errorMessage: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Candidates
      .addCase(fetchCandidates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.candidates = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        toast.error(action.payload);
      })
      // Create Candidate
      .addCase(createCandidate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.candidates.push(action.payload.data);
        toast.success("Candidate created successfully!");
      })
      .addCase(createCandidate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(action.payload);
      })
      // Update Candidate
      .addCase(updateCandidate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCandidate.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("Candidate updated successfully!");
      })
      .addCase(updateCandidate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(action.payload);
      })
      // Delete Candidate
      .addCase(deleteCandidate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCandidate.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("Candidate deleted successfully!");
      })
      .addCase(deleteCandidate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(action.payload);
      });
  },
});

export default candidateSlice.reducer;

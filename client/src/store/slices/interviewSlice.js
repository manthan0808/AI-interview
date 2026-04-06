import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// Analyze resume and get questions
export const analyzeResume = createAsyncThunk(
  "interview/analyzeResume",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/interview/analyze-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to analyze resume");
    }
  }
);

// Create interview session
export const createInterview = createAsyncThunk(
  "interview/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/interview/create", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create interview");
    }
  }
);

// Submit answer
export const submitAnswer = createAsyncThunk(
  "interview/submitAnswer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/interview/submit-answer", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to submit answer");
    }
  }
);

// Fetch interview history
export const fetchHistory = createAsyncThunk(
  "interview/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/api/interview/history");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch history");
    }
  }
);

// Fetch single interview
export const fetchInterviewById = createAsyncThunk(
  "interview/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/api/interview/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch interview");
    }
  }
);

const interviewSlice = createSlice({
  name: "interview",
  initialState: {
    // Resume analysis
    resumeText: "",
    questions: [],
    analysisLoading: false,

    // Current interview session
    currentInterview: null,
    currentQuestionIndex: 0,
    answers: [],
    feedbackList: [],

    // Answer submission
    submitLoading: false,
    latestFeedback: null,

    // History
    history: [],
    historyLoading: false,

    // Single interview report
    report: null,
    reportLoading: false,

    error: null,
  },
  reducers: {
    resetInterview: (state) => {
      state.resumeText = "";
      state.questions = [];
      state.currentInterview = null;
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.feedbackList = [];
      state.latestFeedback = null;
      state.error = null;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
        state.latestFeedback = null;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Analyze Resume
      .addCase(analyzeResume.pending, (state) => {
        state.analysisLoading = true;
        state.error = null;
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.analysisLoading = false;
        state.resumeText = action.payload.resumeText;
        state.questions = action.payload.questions;
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.analysisLoading = false;
        state.error = action.payload;
      })
      // Create Interview
      .addCase(createInterview.fulfilled, (state, action) => {
        state.currentInterview = action.payload.interview;
        state.currentQuestionIndex = 0;
        state.answers = [];
        state.feedbackList = [];
      })
      .addCase(createInterview.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Submit Answer
      .addCase(submitAnswer.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.latestFeedback = action.payload.feedback;
        state.feedbackList.push(action.payload.feedback);
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload;
      })
      // Fetch History
      .addCase(fetchHistory.pending, (state) => {
        state.historyLoading = true;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history = action.payload.interviews;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.error = action.payload;
      })
      // Fetch Interview by ID
      .addCase(fetchInterviewById.pending, (state) => {
        state.reportLoading = true;
      })
      .addCase(fetchInterviewById.fulfilled, (state, action) => {
        state.reportLoading = false;
        state.report = action.payload.interview;
      })
      .addCase(fetchInterviewById.rejected, (state, action) => {
        state.reportLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetInterview, nextQuestion, clearError } = interviewSlice.actions;
export default interviewSlice.reducer;

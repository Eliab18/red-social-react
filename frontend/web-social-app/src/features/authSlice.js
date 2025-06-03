import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Acción asíncrona para cargar los datos del usuario desde el backend
export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No hay token');

    const response = await axios.get('http://localhost:8080/api/auth/', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data; // Cambiado de response.data.user a response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Error desconocido');
  }
});

// Slice para manejar la autenticación
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null, // Añadir token al estado
    isAuthenticated: !!localStorage.getItem('token'),
    status: 'idle',
    error: null,
  },
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    initialize(state) {
      state.isAuthenticated = !!localStorage.getItem('token');
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload; // Guarda los datos del usuario
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
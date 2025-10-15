import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

const initialState = {
    value: null
}

// Fetch User
export const fetchUser = createAsyncThunk('user/fetchUser', async (token) => {
    const { data } = await api.get('/api/user/data', {
        headers: { Authorization: `Bearer ${token}` }
    })
    return data.success ? data.user : null
});

// Update User
export const updateUser = createAsyncThunk(
    'user/update',
    async ({ token, userData }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/api/user/update', userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data?.success) return data.user;
            return rejectWithValue(data?.message || 'Failed to update profile');
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to update profile');
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.value = action.payload;
        }).addCase(updateUser.fulfilled, (state, action) => {
            state.value = action.payload;
        })
    }
});

export default userSlice.reducer;
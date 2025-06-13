import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/posts';

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { getState }) => {
    const { auth } = getState();
    const response = await axios.post(API_URL, postData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data;
  }
);

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { getState }) => {
    const { auth } = getState();
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data;
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { getState }) => {
    const { auth } = getState();
    // The API_URL is 'http://localhost:8080/api/posts'
    // The endpoint for deleting a specific post should be `${API_URL}/${postId}`
    const response = await axios.delete(`${API_URL}/${postId}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    // Assuming the backend returns the deleted post's ID or some confirmation
    // For the reducer, we mainly need the postId to remove it from the state.
    // If response.data contains the id, use it, otherwise return the original postId.
    // Let's assume backend returns { _id: postId } or similar upon successful deletion.
    // Or if it returns nothing (204 No Content), we still have postId.
    // For simplicity, we'll return the original postId to the reducer.
    return postId;
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, content }, { getState }) => {
    const { auth } = getState();
    const response = await axios.put(`${API_URL}/${postId}`, { content }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data;
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    status: 'idle', // for fetching posts
    error: null,    // for fetching posts
    updateStatus: 'idle', // for updating posts
    updateError: null,    // for updating posts
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add post if it doesn't already exist (e.g., to handle potential race conditions or if socket also sends to creator)
        const existingPost = state.posts.find(post => post._id === action.payload._id);
        if (!existingPost) {
          state.posts.unshift(action.payload);
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload; // Assumes fetchPosts brings the whole list
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add deletePost cases here
      .addCase(deletePost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // action.payload will be the postId
        state.posts = state.posts.filter(post => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message; // Or a specific error message for deletion
      })
      // Cases for updatePost
      .addCase(updatePost.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.error.message;
      })
      // Handle the action dispatched when a new post is received via WebSocket
      .addCase('posts/addNewPostFromSocket', (state, action) => {
        // Check if the post already exists to avoid duplicates
        const existingPost = state.posts.find(post => post._id === action.payload._id);
        if (!existingPost) {
          state.posts.unshift(action.payload); // Add new post to the beginning of the array
          // Optionally, you might want to set status, but it's not strictly an async "operation"
          // state.status = 'succeeded';
        } else {
          // Post already exists, perhaps update it if content can change, or do nothing
          console.log('Post already exists in store, not adding duplicate from socket:', action.payload._id);
        }
      })
      .addCase('posts/socketPostDeleted', (state, action) => {
        // action.payload should be { postId: 'some_id' }
        state.posts = state.posts.filter(post => post._id !== action.payload.postId);
      })
      .addCase('posts/socketPostUpdated', (state, action) => {
        // action.payload is the entire updated post object
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        // Optionally, reset updateStatus if it's used to show specific UI feedback for user-initiated updates
        // state.updateStatus = 'idle'; 
      });
  },
});

export default postSlice.reducer;
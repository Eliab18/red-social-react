import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../features/postSlice'; // This slice will need to handle FormData

const CreatePost = () => {
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]); // State for photos
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.posts);
  // const token = useSelector(state => state.auth.token); // For API calls

  const handleFileChange = (e) => {
    setPhotos(Array.from(e.target.files)); // Store selected files
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Make text optional if photos are present, or require at least one of them
    if (!text.trim() && photos.length === 0) {
      alert("Please provide text or at least one photo."); // Or some other UI indication
      return;
    }

    const formData = new FormData();
    formData.append('content', text.trim());
    photos.forEach((photo) => {
      formData.append('photos', photo); // 'photos' should match the backend field name for multer
    });

    // Dispatch the createPost action with formData.
    // The createPost thunk in postSlice will need to be able to send FormData.
    try {
      await dispatch(createPost(formData)).unwrap(); // Use unwrap if createPost is an async thunk returning a promise
      setText('');
      setPhotos([]);
      // Optionally, reset the file input visually if needed, though managing its state directly can be tricky.
      // A common way is to give the input a key that changes, e.g., key={Date.now()} after successful submission.
      // For now, clearing the state `photos` is the main goal.
      if (document.getElementById('fileInput')) { // Simple way to reset file input
          document.getElementById('fileInput').value = "";
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      // Handle error display to user if needed
    }
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border rounded mb-2"
          placeholder="¿Qué estás pensando?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength="500" // Keep or adjust as needed
        />
        {/* File Input */}
        <div className="mb-2">
          <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700">
            Añadir fotos (hasta 5):
          </label>
          <input
            id="fileInput" // Added id for potential reset
            type="file"
            multiple
            accept="image/*" // Accept only image files
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
        </div>

        {/* Display selected file names (optional preview) */}
        {photos.length > 0 && (
          <div className="mb-2 text-sm text-gray-600">
            <p>Archivos seleccionados:</p>
            <ul>
              {photos.map((photo, index) => (
                <li key={index}>{photo.name}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={status === 'loading' || (!text.trim() && photos.length === 0)}
        >
          {status === 'loading' ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
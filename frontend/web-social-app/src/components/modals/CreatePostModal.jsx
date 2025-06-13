import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { createPost } from '../../features/postSlice'; // Adjusted path

const CreatePostModal = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.posts); // Added error for potential display

  useEffect(() => {
    // If the modal is opening, clear any previous text
    if (isOpen) {
      setText('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(createPost({ content: text }))
        .unwrap() // Use unwrap to handle promise lifecycle
        .then(() => {
          setText(''); // Clear text on successful post
          onClose(); // Close modal on successful post
        })
        .catch((err) => {
          // Optional: Handle error (e.g., display a message)
          console.error("Failed to create post:", err);
        });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          aria-label="Close modal"
        >
          <FontAwesomeIcon icon={faXmark} size="lg" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Crear Publicación</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="¿Qué estás pensando?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength="500"
            rows="5" // Added rows for better initial height
          />
          {error && <p className="text-red-500 text-sm mb-2">Error: {typeof error === 'string' ? error : error.message || 'Error al publicar.'}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Publicando...' : 'Publicar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;

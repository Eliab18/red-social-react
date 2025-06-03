import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../features/postSlice';


const CreatePost = () => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.posts);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(createPost({ content: text }));
      setText('');
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
          maxLength="500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
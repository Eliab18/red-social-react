import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../features/postSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';

const CreatePost = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.posts);

  // Cerrar modal con ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Limpiar formulario al cerrar
  useEffect(() => {
    if (!isOpen) {
      setText('');
      setSelectedMedia(null);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(createPost({ content: text, media: selectedMedia }));
      setText('');
      setSelectedMedia(null);
      onClose(); // Cerrar modal después de publicar
    }
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedMedia(file);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const characterCount = text.length;
  const isOverLimit = characterCount > 500;
  const isNearLimit = characterCount > 400;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">U</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">Crear publicación</h3>
              <p className="text-sm text-gray-500">Comparte lo que estás pensando</p>
            </div>
          </div>
          
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Textarea */}
          <div className="relative mb-6">
            <textarea
              className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 text-gray-800 leading-relaxed"
              placeholder="¿Qué estás pensando?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength="500"
              rows="6"
              autoFocus
              style={{ minHeight: '150px' }}
            />
            
            {/* Character Counter */}
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <div className={`text-xs font-medium ${
                isOverLimit ? 'text-red-500' : 
                isNearLimit ? 'text-yellow-500' : 
                'text-gray-400'
              }`}>
                {characterCount}/500
              </div>
              {characterCount > 0 && (
                <div className="relative w-8 h-8">
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`${
                        isOverLimit ? 'text-red-500' : 
                        isNearLimit ? 'text-yellow-500' : 
                        'text-blue-500'
                      }`}
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${(characterCount / 500) * 100}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Media Preview */}
          {selectedMedia && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faCamera} className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{selectedMedia.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedMedia.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMedia(null)}
                  className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-red-600 text-sm" />
                </button>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {/* Media Upload Button */}
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer group">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                <div className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group-hover:bg-blue-50 border border-gray-200">
                  <FontAwesomeIcon 
                    icon={faCamera} 
                    className="text-gray-600 group-hover:text-blue-600 transition-colors" 
                  />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                    Foto/Video
                  </span>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-600 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              
              {/* Publish Button */}
              <button
                type="submit"
                disabled={status === 'loading' || !text.trim() || isOverLimit}
                className="relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
              >
                {status === 'loading' ? (
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    <span>Publicando...</span>
                  </div>
                ) : (
                  <span>Publicar</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
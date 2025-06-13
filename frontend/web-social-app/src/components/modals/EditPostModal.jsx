import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faSpinner, faEdit } from '@fortawesome/free-solid-svg-icons';
import { updatePost } from '../../features/postSlice';

const EditPostModal = ({ isOpen, onClose, post }) => {
  const [content, setContent] = useState('');
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

  useEffect(() => {
    if (post && post.content) {
      setContent(post.content);
    } else {
      setContent(''); 
    }
  }, [post]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    if (content.trim()) {
      dispatch(updatePost({ postId: post._id, content: content.trim() }));
      onClose();
    }
  };

  const characterCount = content.length;
  const isOverLimit = characterCount > 500;
  const isNearLimit = characterCount > 400;
  const hasChanges = post && content !== post.content;

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faEdit} className="text-white text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">Editar publicación</h3>
              <p className="text-sm text-gray-500">Modifica tu contenido</p>
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
        <div className="p-6">
          {/* Textarea */}
          <div className="relative mb-6">
            <textarea
              className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 placeholder-gray-400 text-gray-800 leading-relaxed"
              placeholder="Edita tu publicación..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
                        'text-emerald-500'
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

          {/* Indicador de cambios */}
          {hasChanges && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-amber-700 font-medium">Tienes cambios sin guardar</span>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {/* Info de la publicación original */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Publicación original:</span>
              <span className="font-medium">
                {post?.content?.length > 30 
                  ? `${post.content.substring(0, 30)}...` 
                  : post?.content || 'Sin contenido'
                }
              </span>
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
              
              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={status === 'loading' || !content.trim() || isOverLimit || !hasChanges}
                className="relative px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg shadow-md hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
              >
                {status === 'loading' ? (
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    <span>Guardando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faSave} />
                    <span>Guardar Cambios</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
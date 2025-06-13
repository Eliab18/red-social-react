import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'; // Using faEllipsisH for horizontal dots
import { deletePost } from '../../../features/postSlice'; // Correct path from src/components/layouts/post/
import ConfirmDeleteModal from '../../modals/ConfirmDeleteModal'; // Added import

const PostOptionsMenu = ({ post, currentUserId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Added state
  const dispatch = useDispatch();
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!post || !post.user || post.user._id !== currentUserId) {
    return null; // Don't render anything if the post isn't owned by the current user
  }

  const requestDeleteConfirmation = () => { // New
    setIsMenuOpen(false);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => { // New
    dispatch(deletePost(post._id));
    // setIsConfirmModalOpen(false) is handled by ConfirmDeleteModal's onClose which is passed to it
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit post:', post._id);
    setIsMenuOpen(false); // Close menu after action
  };

  return (
    <> {/* Use Fragment */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
        aria-label="Post options"
      >
        <FontAwesomeIcon icon={faEllipsisH} />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-30 border border-gray-200">
          <ul className="py-1">
            <li>
              <button
                onClick={handleEdit}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" /> Edit
              </button>
            </li>
            <li>
              <button
                onClick={requestDeleteConfirmation} /* MODIFIED */
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete
              </button>
            </li>
          </ul>
        </div>
      )}
      </div>
      <ConfirmDeleteModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="post"
      />
    </>
  );
};

export default PostOptionsMenu;

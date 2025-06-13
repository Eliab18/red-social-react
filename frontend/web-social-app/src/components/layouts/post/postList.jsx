import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../../features/postSlice";
import PostOptionsMenu from './PostOptionsMenu'; // Corrected path

const PostList = () => {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector((state) => state.posts);
  // const { token } = useSelector((state) => state.auth); // Already exists
  const { user: currentUser, token } = useSelector((state) => state.auth); // Add this to get the full user object

  useEffect(() => {
    if (token) {
      dispatch(fetchPosts());
    }
  }, [dispatch, token]);

  // Handle initial loading state (no posts yet)
  if (status === "loading" && posts.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  // Handle no posts after initial load (or if list becomes empty)
  // This condition is now also hit if status is 'succeeded' but posts are empty,
  // or if status is 'loading' but posts were already present (now falls through to list rendering).
  if (posts.length === 0) { // If not loading initially and no posts, or if list becomes empty
    return <div className="text-gray-500 p-4">No hay publicaciones aún</div>;
  }

  // Render the list of posts
  // If status === 'loading' but posts.length > 0, this part will still render,
  // showing the current posts. The list will update once 'deletePost.fulfilled'
  // filters the 'posts' array and status changes to 'succeeded'.
  return (
    <div className="space-y-4">
      {/* Optional: A subtle loading indicator could be placed here if desired when status === 'loading' && posts.length > 0 */}
      {/* Example: {status === "loading" && posts.length > 0 && <div className="text-center text-sm text-gray-500">Updating...</div>} */}
      {posts.map((post) => (
        <div key={post._id} className="p-4 bg-white rounded-lg shadow relative"> {/* Added relative */}
          {/* Post Options Menu - positioned top-right */}
          <div className="absolute top-2 right-2"> {/* Wrapper for positioning */}
            <PostOptionsMenu post={post} currentUserId={currentUser?._id} />
          </div>

          {/* Existing post content */}
          <div className="flex items-center mb-2">
            <span className="font-semibold">
              {post.user?.username || "Usuario desconocido"}
            </span>
            <span className="text-gray-500 text-sm ml-2">
              {new Date(post.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </span>
          </div>
          <p className="text-gray-800">{post.content}</p> {/* Cambiado de text a content */}
          <div className="mt-2 text-gray-500">
            {post.likes?.length || 0} Me gusta
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
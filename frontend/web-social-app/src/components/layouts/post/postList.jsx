import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../../features/postSlice";

const PostList = () => {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector((state) => state.posts);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchPosts());
    }
  }, [dispatch, token]);

  if (status === "loading") {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (posts.length === 0) {
    return <div className="text-gray-500 p-4">No hay publicaciones aún</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post._id} className="p-4 bg-white rounded-lg shadow">
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
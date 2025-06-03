import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client"; // Import io
import { fetchUserData } from '../../src/features/authSlice';
import { fetchPosts } from '../../src/features/postSlice';
import Sidebar from "../components/Sidebar/sidebar";
import CreatePost from "../components/inputPost/createPost";
import PostList from "../components/layouts/post/postList";

// Define the backend URL. Consider using environment variables for this.
const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";

const DashboardPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, status, user } = useSelector((state) => state.auth);
  // const [socket, setSocket] = useState(null); // Optional: if you need to use the socket instance elsewhere

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserData());
      dispatch(fetchPosts());

      // Initialize Socket.IO connection
      const newSocket = io(SOCKET_SERVER_URL, {
        // Optional: Add withCredentials if your server requires cookies/sessions
        // withCredentials: true,
        // Optional: Add auth token if your socket connection needs it
        // auth: {
        //  token: "your_jwt_token_if_needed_for_socket_auth"
        // }
      });
      // setSocket(newSocket); // Store socket instance if needed

      newSocket.on("connect", () => {
        console.log("Connected to WebSocket server with ID:", newSocket.id);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Disconnected from WebSocket server:", reason);
      });

      // It's good practice to handle connection errors
      newSocket.on("connect_error", (error) => {
        console.error("WebSocket connection error:", error);
      });

      // Listen for new posts
      newSocket.on('new_post', (post) => {
        console.log('Received new_post event from server:', post);
        // TODO: In the next step, create an actual action creator and reducer for this.
        // For now, dispatching an action that postSlice will handle.
        // Ensure the post object structure from socket matches what Redux expects.
        // The backend now populates user details, so it should be fine.
        dispatch({ type: 'posts/addNewPostFromSocket', payload: post });
      });

      // Cleanup on component unmount
      return () => {
        console.log("Disconnecting WebSocket and cleaning up listeners...");
        newSocket.off('new_post'); // Remove listener for 'new_post'
        newSocket.disconnect();
        // setSocket(null);
      };
    }
  }, [dispatch, isAuthenticated]); // Re-run if isAuthenticated changes

  if (status === "loading" && !user) { // Show loading only if user data isn't there yet
    return <div>Cargando dashboard...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={setIsSidebarCollapsed}
          className={`flex-none transition-all duration-300 ${
            isSidebarCollapsed ? "w-20" : "w-64"
          } bg-gray-800`}
        />
        <div className="flex-1 flex overflow-y-auto">
          <main className="flex-1 max-w-2xl mx-auto p-4 space-y-6">
            <div className="sticky top-0 bg-gray-900 pt-4 pb-2 z-10">
              {user && (
                <h1 className="text-2xl font-bold text-white">
                  Hola, {user?.username}
                </h1>
              )}
              <CreatePost />
            </div>
            <PostList />
          </main>
          <aside className="hidden lg:block w-80 flex-none p-4 bg-gray-800 border-l border-gray-700">
            <h3 className="text-white font-bold mb-4">Personas Sugeridas</h3>
            {/* ... */}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
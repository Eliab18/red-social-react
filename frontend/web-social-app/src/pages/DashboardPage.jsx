import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from '../../src/features/authSlice'; // Importa la acción fetchUserData
import { fetchPosts } from '../../src/features/postSlice'; // Importa la acción fetchPosts
import Sidebar from "../components/Sidebar/sidebar"; // Importa el componente Sidebar
import CreatePost from "../components/inputPost/createPost"; // Importa el componente CreatePost
import PostList from "../components/layouts/post/postList"; // Importa el componente PostList

const DashboardPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, status, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserData());
      dispatch(fetchPosts());
    }
  }, [dispatch, isAuthenticated]); // ← Dependencia correcta

  if (status === "loading") {
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
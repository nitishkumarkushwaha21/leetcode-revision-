import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import TopicPage from "./pages/TopicPage";
import WorkspacePage from "./pages/WorkspacePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  // Simple light/dark mode logic - can be expanded later
  const [isDarkMode, setIsDarkMode] = useState(true);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <AuthProvider>
      <div
        className={`min-h-screen font-sans bg-gray-900 ${
          isDarkMode ? "dark" : ""
        }`}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/topics/:topicName" element={<TopicPage />} />
          <Route path="/workspace/:questionId" element={<WorkspacePage />} />
          <Route path="/workspace/new" element={<WorkspacePage />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;

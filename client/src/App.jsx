import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import FolderView from "./pages/FolderView";
import ProblemWorkspace from "./components/layout/ProblemWorkspace";
import PlaylistFeaturePage from "./pages/PlaylistFeaturePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="folder/:id" element={<FolderView />} />
        <Route path="problem/:id" element={<ProblemWorkspace />} />
        <Route path="playlist" element={<PlaylistFeaturePage />} />
      </Route>
    </Routes>
  );
}

export default App;

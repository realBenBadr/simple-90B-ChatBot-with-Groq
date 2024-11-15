import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Chat } from './pages/Chat';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/chat" /> : <Login />} />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} />} />
      <Route path="*" element={<Navigate to={user ? "/chat" : "/login"} />} />
    </Routes>
  );
}

export default App;
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Home from './pages/Home.jsx';
import LiveRunner from './pages/LiveRunner.jsx';
import Challenges from './pages/Challenges.jsx';
import ProblemSolve from './pages/ProblemSolve.jsx';
import InterviewPrep from './pages/InterviewPrep.jsx';
import Notes from './pages/Notes.jsx';
import Tutorial from './pages/Tutorial.jsx';

export default function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
        />
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/home" replace /> : <AuthPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
        />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/home" element={<Home />} />
          <Route path="/runner" element={<LiveRunner />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenges/:id" element={<ProblemSolve />} />
          <Route path="/interview" element={<InterviewPrep />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/learn/:slug" element={<Tutorial />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

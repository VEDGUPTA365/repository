import {BrowserRouter as Router,Route,Routes, Navigate} from "react-router-dom";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Navbar from "./Components/NavBar";


import { Toaster } from 'react-hot-toast';
import Footer from "./Components/Footer";
import Profile from "./Pages/Profile";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import MainQuizzSection from "./Pages/MainQuizzSection";
import GenerateQuizWithAI from "./Pages/GenerateQuizWithAI";
import SharedQuiz from "./Pages/SharedQuiz";
import BattleLobby from "./Pages/BattleLobby";
import BattleGame from "./Pages/BattleGame";

function App() {

  const {user, checkAuth, error} = useAuthStore();

  useEffect(() => {
    checkAuth();
  },[checkAuth])

  // === if user is login ===
  const RedirectToHome = ({children}) => {
    const {isAuthenticated} = useAuthStore();
    if(isAuthenticated)
      return <Navigate to='/' replace />
    return children;
  }

  // === is user authenticated ===
  const ProtectedRoute = ({children}) => {
    const {isAuthenticated} = useAuthStore();
    if(!isAuthenticated)
      return <Navigate to='/login' replace />
    return children;
  }

  return (
    <section className="mx-auto max-w-[1440px]">

      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={
            <RedirectToHome>
              <Signup />
            </RedirectToHome>
            } />
          <Route path="/login" element={
            <RedirectToHome>
              <Login />
            </RedirectToHome>
            } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute> 
            } />


          {/* ============= QUIZ ============= */}

          <Route path="/allquiz" element={
            <ProtectedRoute>
              <MainQuizzSection />
            </ProtectedRoute> 
            } />

          <Route path="/quiz-with-ai" element={
            <ProtectedRoute>
              <GenerateQuizWithAI />
            </ProtectedRoute> 
          } />

          {/* Share link — login required to play */}
          <Route path="/quiz/shared/:id" element={
            <ProtectedRoute>
              <SharedQuiz />
            </ProtectedRoute>
          } />

          {/* ============= BATTLE ============= */}

          <Route path="/battle" element={
            <ProtectedRoute>
              <BattleLobby />
            </ProtectedRoute>
          } />

          <Route path="/battle/game" element={
            <ProtectedRoute>
              <BattleGame />
            </ProtectedRoute>
          } />

          {/* ==== all other routes will navigate to home page (*) ==== */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
        <Footer />
      </Router>
    
      <Toaster 
      toastOptions={{
        className: ' text-xs sm:text-xs',
      }}
      />
    </section>
  )
}

export default App

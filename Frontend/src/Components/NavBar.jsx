import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { IoIosLogOut } from "react-icons/io";

const Navbar = () => {
  const { logout } = useAuthStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
      toast.error("Error logging out. Please try again.");
    }
  }

  const linkClass = ({ isActive }) =>
    `hover-cursorCSS text-sm transition-all duration-150 ${
      isActive ? "font-bold text-black" : "text-gray-500 hover:text-black"
    }`;

  return (
    <nav className="flex items-center justify-between py-4 px-5 sm:px-10 w-full border-b border-gray-100 bg-white sticky top-0 z-50">
      <NavLink to="/" className="hover-cursorCSS font-bold text-lg tracking-tight" style={{ fontFamily: "'Space Mono', monospace" }}>
        QuizBuddy
      </NavLink>

      <div className="flex items-center gap-x-5 text-sm">
        {isAuthenticated ? (
          <>
            <NavLink to="/"        className={linkClass}>Home</NavLink>
            <NavLink to="/profile" className={linkClass}>Profile</NavLink>
            <NavLink to="/allquiz" className={linkClass}>Quizzes</NavLink>
            <NavLink to="/battle"  className={linkClass}>Battle</NavLink>
            <button
              onClick={handleLogout}
              className="hover-cursorCSS flex items-center gap-1 text-gray-400 hover:text-black transition-colors"
              title="Logout"
            >
              <IoIosLogOut className="text-lg" />
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login"  className={linkClass}>Login</NavLink>
            <NavLink to="/signup" className={({ isActive }) =>
              `hover-cursorCSS btn-primary text-xs py-2 px-4 ${isActive ? "opacity-80" : ""}`
            }>
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

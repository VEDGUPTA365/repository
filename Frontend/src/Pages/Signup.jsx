import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Signup = () => {
  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      navigate("/profile");
    } catch (err) {
      // error toast handled in authStore
    }
  };

  return (
    <section className="flexCenter px-4 min-h-[77vh] bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="font-bold text-lg text-black tracking-tight">Create an account</h1>
          <p className="text-xs text-gray-400 mt-1">Start building and playing AI quizzes today.</p>
        </div>

        <form onSubmit={handleSignUp} className="px-6 py-5 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-bw"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-bw"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-bw"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`hover-cursorCSS btn-primary w-full mt-1 ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Creating account…" : "Sign Up"}
          </button>

          <p className="text-center text-xs text-gray-400">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="hover-cursorCSS text-black font-medium cursor-pointer">
              Log in
            </span>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Signup;
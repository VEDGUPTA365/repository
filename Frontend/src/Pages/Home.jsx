import React from "react";
import { useNavigate } from "react-router-dom";
import BlurFade from "../Components/magicui/BlurFade";
import Features from "../Components/Features";

const Home = () => {
  const navigate = useNavigate();

  return (
    <section className="flexCenter min-h-[77vh] flex-col bg-white">

      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="flexCenter flex-col min-h-[80vh] text-center px-6 gap-y-7 w-full bg-white relative overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <BlurFade delay={0.1} inView>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-gray-400 border border-gray-200 rounded-full px-4 py-1.5 mb-2">
            AI-Powered Quiz Platform
          </span>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
            Quiz<span className="text-gray-400">Buddy</span>
          </h1>
        </BlurFade>

        <BlurFade delay={0.35} inView>
          <p className="text-gray-500 text-base sm:text-lg max-w-[520px] leading-relaxed">
            Generate AI-powered quizzes from any topic or PDF. Challenge friends
            to live 1v1 battles. Track your progress — all in one place.
          </p>
        </BlurFade>

        <BlurFade delay={0.5} inView>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <button
              onClick={() => navigate("/allquiz")}
              className="hover-cursorCSS btn-primary text-sm px-6 py-2.5"
            >
              Get Started →
            </button>
            <button
              onClick={() => navigate("/battle")}
              className="hover-cursorCSS btn-secondary text-sm px-6 py-2.5"
            >
              ⚔️ 1v1 Battle
            </button>
          </div>
        </BlurFade>

        <BlurFade delay={0.65} inView>
          <p className="text-xs text-gray-400 mt-2">
            Join thousands of learners · No credit card required
          </p>
        </BlurFade>
      </header>

      {/* ── Features ─────────────────────────────────────── */}
      <Features />
    </section>
  );
};

export default Home;

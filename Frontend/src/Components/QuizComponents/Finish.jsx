import React from "react";

const Finish = ({ score, maxScore, dispatch }) => {
  const per = Math.floor((score / maxScore) * 100);
  const emoji = per >= 80 ? "🏆" : per >= 50 ? "🎯" : "📚";
  const label = per >= 80 ? "Excellent!" : per >= 50 ? "Good job!" : "Keep practicing!";

  return (
    <div className="flex flex-col items-center gap-5 py-10 text-center fade-up">
      <span className="text-5xl">{emoji}</span>
      <h2 className="text-2xl font-bold tracking-tight text-black">{label}</h2>

      {/* Score ring */}
      <div className="border-2 border-black rounded-full w-28 h-28 flexCenter flex-col">
        <p className="text-3xl font-black">{per}<span className="text-base font-normal text-gray-400">%</span></p>
        <p className="text-xs text-gray-400">accuracy</p>
      </div>

      <p className="text-sm text-gray-500">
        You scored <b className="text-black">{score}</b> out of <b className="text-black">{maxScore}</b>
      </p>

      <button onClick={() => dispatch({ type: "restart" })} className="hover-cursorCSS btn-secondary text-sm mt-2">
        Try Again
      </button>
    </div>
  );
};

export default Finish;
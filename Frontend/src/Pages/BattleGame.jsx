import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { getSocket } from "./BattleLobby";
import Question from "../Components/QuizComponents/Question";

const BattleGame = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { questions = [], players: initialPlayers = [], roomCode, isHost, playerName } = location.state || {};

  const [players, setPlayers] = useState(initialPlayers);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("active");
  const [gameResult, setGameResult] = useState(null);
  const [opponentFinished, setOpponentFinished] = useState(false);
  const socketRef = useRef(null);
  const myName = playerName || user?.name || "You";
  const noOfQuest = questions.length;

  useEffect(() => { if (!questions.length) navigate("/battle"); }, [questions, navigate]);

  useEffect(() => {
    socketRef.current = getSocket();
    const s = socketRef.current;
    s.on("scoreUpdate", ({ players: ps }) => { setPlayers(ps); if (ps.find((p) => p.name !== myName)?.finished) setOpponentFinished(true); });
    s.on("gameOver",   ({ players: ps, winner, totalQuestions: tq }) => { setGameStatus("finished"); setPlayers(ps); setGameResult({ winner, totalQuestions: tq, players: ps }); });
    s.on("playerLeft", ({ msg }) => { setGameStatus("finished"); setGameResult({ disconnected: true, msg }); });
    return () => { s.off("scoreUpdate"); s.off("gameOver"); s.off("playerLeft"); };
  }, [myName]);

  const dispatch = ({ type, payload }) => {
    if (type === "newAnswer") {
      if (answer !== null) return;
      setAnswer(payload);
      const isCorrect = payload === questions[index].answer;
      if (isCorrect) setScore((s) => s + 1);
      socketRef.current.emit("submitAnswer", { roomCode, questionIndex: index, answerIndex: payload });
    }
  };

  const handleFinish = () => socketRef.current.emit("playerFinished", { roomCode });

  // ── DISCONNECTED ──
  if (gameStatus === "finished" && gameResult?.disconnected) {
    return (
      <section className="min-h-[80vh] flexCenter px-4 bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center max-w-sm w-full flex flex-col gap-4">
          <span className="text-4xl">😔</span>
          <h2 className="font-bold text-lg text-black">Opponent Left</h2>
          <p className="text-gray-400 text-sm">{gameResult.msg}</p>
          <button onClick={() => navigate("/battle")} className="hover-cursorCSS btn-primary w-full mt-2">Back to Lobby</button>
        </div>
      </section>
    );
  }

  // ── FINISHED ──
  if (gameStatus === "finished") {
    const isWinner = gameResult?.winner === myName;
    const isDraw   = gameResult?.winner === null;
    const total    = gameResult?.totalQuestions || noOfQuest;
    const emoji    = isDraw ? "🤝" : isWinner ? "🏆" : "😤";
    const label    = isDraw ? "It's a Draw!" : isWinner ? "You Won!" : "You Lost!";

    return (
      <section className="min-h-[80vh] flexCenter px-4 bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center max-w-sm w-full flex flex-col gap-5">
          <span className="text-5xl">{emoji}</span>
          <h2 className="font-bold text-2xl tracking-tight text-black">{label}</h2>

          {/* Score cards */}
          <div className="flex gap-3">
            {gameResult?.players?.map((p) => {
              const isMe = p.name === myName;
              return (
                <div key={p.name} className={`flex-1 rounded-xl p-4 border ${isMe ? "border-black bg-gray-50" : "border-gray-100 bg-white"}`}>
                  <p className="text-xs text-gray-400 mb-1">{isMe ? "You" : "Opponent"}</p>
                  <p className="font-semibold text-sm text-black">{p.name}</p>
                  <p className="text-3xl font-black text-black mt-1">{p.score}<span className="text-gray-300 font-normal text-sm">/{total}</span></p>
                </div>
              );
            })}
          </div>

          <button onClick={() => navigate("/battle")} className="hover-cursorCSS btn-primary w-full">Play Again</button>
          <button onClick={() => navigate("/allquiz")} className="hover-cursorCSS text-xs text-gray-400 hover:text-black transition-colors">Back to Quizzes</button>
        </div>
      </section>
    );
  }

  // ── ACTIVE GAME ──
  const iWaiting = index >= noOfQuest && !opponentFinished;

  return (
    <section className="min-h-[80vh] py-8 px-4 flex flex-col items-center gap-5 max-w-[760px] mx-auto w-full">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between">
        <h1 className="font-bold text-lg text-black">⚔️ Battle</h1>
        <span className="text-xs text-gray-400 font-mono bg-gray-100 px-3 py-1 rounded-full">{roomCode}</span>
      </div>

      {/* Scoreboard */}
      <div className="w-full grid grid-cols-2 gap-3">
        {players.map((p) => {
          const isMe = p.name === myName;
          const pct  = noOfQuest > 0 ? (p.score / noOfQuest) * 100 : 0;
          return (
            <div key={p.name} className={`rounded-xl p-4 border ${isMe ? "border-black bg-gray-50" : "border-gray-100 bg-white"}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-full flexCenter text-xs font-bold ${isMe ? "bg-black text-white" : "bg-gray-200 text-gray-600"}`}>
                  {p.name[0].toUpperCase()}
                </div>
                <span className="text-xs font-medium text-black">{isMe ? "You" : "Opponent"}</span>
                {p.finished && <span className="ml-auto text-xs text-gray-400">Done ✓</span>}
              </div>
              <p className="text-2xl font-black text-black">{p.score}<span className="text-gray-300 font-normal text-sm">/{noOfQuest}</span></p>
              <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <progress className="w-full" max={noOfQuest} value={index + Number(answer !== null)} />
      <div className="w-full flex justify-between text-xs text-gray-400 -mt-3">
        <span>Q {Math.min(index + 1, noOfQuest)}/{noOfQuest}</span>
        <span>Score: {score}/{noOfQuest}</span>
      </div>

      {/* Question / waiting */}
      {iWaiting ? (
        <div className="flexCenter flex-col gap-4 mt-10 text-center">
          <span className="text-4xl">⏳</span>
          <h2 className="font-bold text-lg text-black">You're done!</h2>
          <p className="text-gray-400 text-sm animate-pulse">Waiting for your opponent…</p>
          <p className="text-2xl font-black text-black mt-2">{score}<span className="text-gray-400 font-normal text-base">/{noOfQuest}</span></p>
        </div>
      ) : (
        index < noOfQuest && (
          <div className="w-full max-w-[600px]">
            <Question quest={questions[index]} dispatch={dispatch} answer={answer} />
            <div className="flex justify-center mt-6">
              {index < noOfQuest - 1 && answer !== null ? (
                <button onClick={() => { setAnswer(null); setIndex((i) => i + 1); }} className="hover-cursorCSS btn-secondary text-sm">
                  Next →
                </button>
              ) : index === noOfQuest - 1 && answer !== null ? (
                <button onClick={handleFinish} className="hover-cursorCSS btn-primary text-sm">
                  Finish Battle
                </button>
              ) : null}
            </div>
          </div>
        )
      )}
    </section>
  );
};

export default BattleGame;

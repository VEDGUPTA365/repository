import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import axios from "axios";

const SOCKET_URL = import.meta.env.MODE === "development" ? "http://localhost:8080" : "/";
const backend_base_url = import.meta.env.MODE === "development" ? "http://localhost:8080/api/quiz" : "/api/quiz";

let socket = null;
export function getSocket() {
  if (!socket) socket = io(SOCKET_URL, { withCredentials: true });
  return socket;
}
export function disconnectSocket() {
  if (socket) { socket.disconnect(); socket = null; }
}

const BattleLobby = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState("home");
  const [roomCode, setRoomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [quizList, setQuizList] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    const preCode = searchParams.get("join");
    if (preCode) { setInputCode(preCode.toUpperCase()); setMode("join"); }

    setLoadingQuizzes(true);
    axios.get(`${backend_base_url}/getallquiz`, { withCredentials: true })
      .then((res) => setQuizList(res.data.quiz || []))
      .catch(() => toast.error("Failed to load quizzes"))
      .finally(() => setLoadingQuizzes(false));
  }, []);

  useEffect(() => {
    socketRef.current = getSocket();
    const s = socketRef.current;

    s.on("roomCreated", ({ roomCode: code }) => { setRoomCode(code); setIsHost(true); setMode("waiting"); });
    s.on("playerJoined", ({ players: ps, quizTitle: qt, totalQuestions: tq }) => { setPlayers(ps); setQuizTitle(qt); setTotalQuestions(tq); });
    s.on("gameStarted", ({ questions, players: ps }) => {
      navigate("/battle/game", { state: { questions, players: ps, roomCode, isHost, playerName: user?.name } });
    });
    s.on("joinError",  ({ msg }) => { setError(msg); toast.error(msg); });
    s.on("startError", ({ msg }) => toast.error(msg));
    s.on("playerLeft", ({ msg }) => { toast.error(msg); setMode("home"); setPlayers([]); setRoomCode(""); });

    return () => { s.off("roomCreated"); s.off("playerJoined"); s.off("gameStarted"); s.off("joinError"); s.off("startError"); s.off("playerLeft"); };
  }, [roomCode, isHost, navigate, user]);

  const handleCreate = () => {
    if (!selectedQuizId) { toast.error("Please select a quiz first"); return; }
    const quiz = quizList.find((q) => String(q.id) === String(selectedQuizId));
    socketRef.current.emit("createRoom", { quizId: quiz.id, quizTitle: quiz.title, questions: quiz.questions, playerName: user?.name || "Player 1" });
    setPlayers([{ name: user?.name || "Player 1", score: 0 }]);
    setQuizTitle(quiz.title);
    setTotalQuestions(quiz.questions.length);
  };

  const handleJoin = () => {
    if (!inputCode.trim()) { toast.error("Enter a room code"); return; }
    setError("");
    socketRef.current.emit("joinRoom", { roomCode: inputCode.trim().toUpperCase(), playerName: user?.name || "Player 2" });
    setRoomCode(inputCode.trim().toUpperCase()); setIsHost(false); setMode("waiting");
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(`${window.location.origin}/battle?join=${roomCode}`);
    toast.success("Invite link copied!");
  };
  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast.success("Room code copied!");
  };

  return (
    <section className="min-h-[80vh] flexCenter px-4 py-10 bg-gray-50">
      <div className="w-full max-w-sm">

        {/* ── HOME ── */}
        {mode === "home" && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h1 className="font-bold text-lg text-black tracking-tight">⚔️ 1v1 Battle</h1>
              <p className="text-xs text-gray-400 mt-1">Challenge a friend to a live quiz duel.</p>
            </div>
            <div className="px-6 py-5 flex flex-col gap-3">
              <button onClick={() => setMode("create")} className="hover-cursorCSS btn-primary w-full">Host a Battle</button>
              <button onClick={() => setMode("join")}   className="hover-cursorCSS btn-secondary w-full">Join a Battle</button>
            </div>
          </div>
        )}

        {/* ── CREATE ── */}
        {mode === "create" && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <button onClick={() => setMode("home")} className="hover-cursorCSS text-gray-400 hover:text-black text-xs">← Back</button>
              <h2 className="font-bold text-base text-black">Host a Battle</h2>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Select Quiz</label>
                {loadingQuizzes ? (
                  <p className="text-gray-400 text-xs">Loading quizzes…</p>
                ) : (
                  <select
                    value={selectedQuizId}
                    onChange={(e) => setSelectedQuizId(e.target.value)}
                    className="input-bw"
                  >
                    <option value="">— Choose a quiz —</option>
                    {quizList.map((q) => (
                      <option key={q.id} value={q.id}>{q.title} ({q.questions?.length || 0} Q)</option>
                    ))}
                  </select>
                )}
              </div>
              <button onClick={handleCreate} disabled={!selectedQuizId} className="hover-cursorCSS btn-primary w-full disabled:opacity-40">
                Create Room
              </button>
            </div>
          </div>
        )}

        {/* ── JOIN ── */}
        {mode === "join" && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <button onClick={() => setMode("home")} className="hover-cursorCSS text-gray-400 hover:text-black text-xs">← Back</button>
              <h2 className="font-bold text-base text-black">Join a Battle</h2>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Room Code</label>
                <input
                  value={inputCode}
                  onChange={(e) => { setInputCode(e.target.value.toUpperCase()); setError(""); }}
                  placeholder="ABC123"
                  maxLength={6}
                  className="input-bw text-center text-2xl font-mono tracking-[0.4em] uppercase"
                />
                {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
              </div>
              <button onClick={handleJoin} className="hover-cursorCSS btn-primary w-full">Join Room</button>
            </div>
          </div>
        )}

        {/* ── WAITING ── */}
        {mode === "waiting" && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="font-bold text-base text-black">Waiting Room</h2>
              {quizTitle && <p className="text-xs text-gray-400 mt-1">📋 {quizTitle} · {totalQuestions} questions</p>}
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">
              {/* Room code */}
              {isHost && roomCode && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Room Code</p>
                  <p className="text-4xl font-mono font-black tracking-[0.3em] text-black">{roomCode}</p>
                  <div className="flex gap-2 justify-center mt-3">
                    <button onClick={handleCopyCode}   className="hover-cursorCSS btn-secondary text-xs py-1.5 px-3">Copy Code</button>
                    <button onClick={handleCopyInvite} className="hover-cursorCSS btn-primary  text-xs py-1.5 px-3">Copy Link</button>
                  </div>
                </div>
              )}

              {/* Player list */}
              <div className="flex flex-col gap-2">
                {[0, 1].map((i) => (
                  <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${players[i] ? "border-black bg-gray-50" : "border-dashed border-gray-200"}`}>
                    <div className={`w-8 h-8 rounded-full flexCenter text-xs font-bold ${players[i] ? "bg-black text-white" : "bg-gray-100 text-gray-400"}`}>
                      {players[i] ? players[i].name[0].toUpperCase() : "?"}
                    </div>
                    <span className={`text-sm ${players[i] ? "text-black font-medium" : "text-gray-400"}`}>
                      {players[i] ? players[i].name : i === 0 ? "Waiting for host…" : "Waiting for opponent…"}
                    </span>
                    {players[i] && <span className="ml-auto text-xs text-gray-400">Ready ✓</span>}
                  </div>
                ))}
              </div>

              {players.length < 2 && (
                <p className="text-xs text-gray-400 text-center animate-pulse">Waiting for opponent to join…</p>
              )}

              {isHost && players.length >= 2 && (
                <button onClick={() => socketRef.current.emit("startGame", { roomCode })} className="hover-cursorCSS btn-primary w-full">
                  Start Battle →
                </button>
              )}
              {!isHost && players.length >= 2 && (
                <p className="text-xs text-gray-400 text-center animate-pulse">Waiting for host to start…</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BattleLobby;

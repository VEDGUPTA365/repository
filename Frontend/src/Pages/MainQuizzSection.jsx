import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Quiz from "./Quiz";
import toast from "react-hot-toast";

const backend_base_url =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080/api/quiz"
    : "/api/quiz";

const MainQuizzSection = () => {
  const navigate = useNavigate();
  const [allQuiz, setAllQuiz] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");

  useEffect(() => {
    axios
      .get(`${backend_base_url}/getallquiz`)
      .then((res) => setAllQuiz(res.data.quiz || []))
      .catch(() => toast.error("Failed to fetch quizzes"));
  }, []);

  const handleShare = (quiz) => {
    navigator.clipboard.writeText(`${window.location.origin}/quiz/shared/${quiz.shareToken}`);
    toast.success("Share link copied!");
  };

  const handleBattle = (quiz) => {
    navigate("/battle", { state: { prefillQuizId: quiz.id, prefillQuizTitle: quiz.title } });
  };

  const handleDelete = async (quiz) => {
    if (!window.confirm(`Delete "${quiz.title}"?`)) return;
    try {
      await axios.delete(`${backend_base_url}/deletequiz/${encodeURIComponent(quiz.title)}`);
      setAllQuiz(allQuiz.filter((q) => q.id !== quiz.id));
      toast.success("Quiz deleted");
    } catch {
      toast.error("Failed to delete quiz");
    }
  };

  if (quizTitle) return <Quiz topic={quizTitle} />;

  return (
    <main className="min-h-[77vh] bg-white px-5 sm:px-10 py-10 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Your Quizzes</h1>
          <p className="text-sm text-gray-400 mt-1">{allQuiz.length} quiz{allQuiz.length !== 1 ? "zes" : ""} available</p>
        </div>
        <button
          onClick={() => navigate("/quiz-with-ai")}
          className="hover-cursorCSS btn-primary text-xs"
        >
          + Generate with AI
        </button>
      </div>

      {/* Quiz grid */}
      {allQuiz.length === 0 ? (
        <div className="flexCenter flex-col gap-4 py-24 text-center">
          <span className="text-4xl">📋</span>
          <p className="text-gray-400 text-sm">No quizzes yet. Generate one with AI!</p>
          <button onClick={() => navigate("/quiz-with-ai")} className="hover-cursorCSS btn-primary text-xs mt-2">
            Generate Quiz
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allQuiz.map((quiz) => (
            <div key={quiz.id} className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              {/* Delete */}
              <button
                onClick={() => handleDelete(quiz)}
                className="hover-cursorCSS absolute top-3 right-3 text-gray-300 hover:text-black transition-colors opacity-0 group-hover:opacity-100 text-xs font-bold"
                title="Delete"
              >
                ✕
              </button>

              {/* Title */}
              <button
                onClick={() => setQuizTitle(quiz.title)}
                className="hover-cursorCSS text-left font-semibold text-black text-sm leading-snug line-clamp-2 mb-2 w-full"
              >
                {quiz.title}
              </button>
              <p className="text-xs text-gray-400 mb-4">{quiz.questions?.length || 0} questions</p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setQuizTitle(quiz.title)}
                  className="hover-cursorCSS flex-1 text-xs py-1.5 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                >
                  Play
                </button>
                <button
                  onClick={() => handleShare(quiz)}
                  className="hover-cursorCSS text-xs py-1.5 px-3 rounded-lg border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-colors"
                  title="Copy share link"
                >
                  🔗
                </button>
                <button
                  onClick={() => handleBattle(quiz)}
                  className="hover-cursorCSS text-xs py-1.5 px-3 rounded-lg border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-colors"
                  title="1v1 Battle"
                >
                  ⚔️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Battle shortcut */}
      <div className="mt-10 pt-6 border-t border-gray-100 text-center">
        <button
          onClick={() => navigate("/battle")}
          className="hover-cursorCSS text-sm text-gray-400 hover:text-black transition-colors"
        >
          ⚔️ Join an existing battle by room code →
        </button>
      </div>
    </main>
  );
};

export default MainQuizzSection;

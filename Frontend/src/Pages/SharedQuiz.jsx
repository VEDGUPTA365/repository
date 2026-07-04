import React, { useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../Components/QuizComponents/Loading";
import Error from "../Components/QuizComponents/Error";
import Question from "../Components/QuizComponents/Question";

const backend_base_url =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080/api/quiz"
    : "/api/quiz";

const initialState = {
  quiz: null,
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  score: 0,
  errorMsg: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, quiz: action.payload, questions: action.payload.questions, status: "ready", errorMsg: null };
    case "dataFailed":
      return { ...state, status: "error", errorMsg: action.payload };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer": {
      const quest = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        score: action.payload === quest.answer ? state.score + 1 : state.score,
      };
    }
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return { ...state, status: "finished" };
    case "restart":
      return { ...initialState, quiz: state.quiz, questions: state.questions, status: "ready" };
    default:
      throw new Error("Unknown Action");
  }
}

const SharedQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [{ quiz, questions, status, index, answer, score, errorMsg }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`${backend_base_url}/shared/${id}`, { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Failed to fetch quiz");
        dispatch({ type: "dataReceived", payload: data.quiz });
      } catch (err) {
        dispatch({ type: "dataFailed", payload: err.message });
      }
    };
    fetchQuiz();
  }, [id]);

  const noOfQuest = questions.length;
  const per = Math.floor((score / noOfQuest) * 100);

  return (
    <section className="flex items-center flex-col gap-y-6 max-w-[650px] mx-auto min-h-[80vh] py-10">
      {/* Back button */}
      <button
        onClick={() => navigate("/allquiz")}
        className="self-start ml-4 text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1"
      >
        ← Back to All Quizzes
      </button>

      <header className="font-sans font-bold text-center sm:text-5xl text-3xl gradient-text2 pb-4">
        {quiz?.title || "Shared Quiz"}
      </header>

      <div className="text-xs text-gray-400 -mt-4 bg-purple-50 border border-purple-200 rounded-full px-3 py-1">
        🔗 Shared Quiz
      </div>

      {status !== "loading" && status !== "error" && (
        <div className="flexCenter rounded-xl overflow-hidden w-full px-6">
          <progress className="h-[6px] w-full" max={noOfQuest} value={index + Number(answer !== null)} />
        </div>
      )}

      {status !== "loading" && status !== "error" && status !== "finished" && (
        <div className="flexBetween px-10 w-full">
          <p>{index + 1}/{noOfQuest} Question</p>
          <h2>Score {score * 10}/{noOfQuest * 10}</h2>
        </div>
      )}

      {status === "loading" && <Loading />}
      {status === "error" && <Error errorMsg={errorMsg} />}

      {status === "ready" && (
        <button
          className="hover-cursorCSS px-4 py-2 hover:scale-125 transition-all rounded-xl bg-slate-100 mt-20"
          onClick={() => dispatch({ type: "start" })}
        >
          Start Quiz
        </button>
      )}

      {status === "active" && (
        <>
          <Question quest={questions[index]} dispatch={dispatch} answer={answer} />
          {index < noOfQuest - 1 && answer !== null ? (
            <button
              onClick={() => dispatch({ type: "nextQuestion" })}
              className="hover-cursorCSS py-2 bg-gray-100 rounded-lg mt-4 text-sm px-4"
            >
              Next Question
            </button>
          ) : (
            index === noOfQuest - 1 && answer !== null && (
              <button
                onClick={() => dispatch({ type: "finish" })}
                className="hover-cursorCSS p-2 bg-blue-500 font-bold text-white rounded-lg mt-4 text-sm"
              >
                Finish the test
              </button>
            )
          )}
        </>
      )}

      {status === "finished" && (
        <div className="flexCenter gap-y-6 flex-col px-4 mt-10">
          <div className="text-6xl">{per >= 80 ? "🏆" : per >= 50 ? "🎯" : "📚"}</div>
          <h2 className="text-2xl font-bold gradient-text2">Quiz Complete!</h2>
          <p className="text-lg">Your score: <b>{score * 10}</b> / {noOfQuest * 10}</p>
          <p className="text-gray-500">Accuracy: {per}%</p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => dispatch({ type: "restart" })}
              className="hover-cursorCSS p-2 px-4 border border-black rounded-xl text-sm"
            >
              Restart Quiz
            </button>
            <button
              onClick={() => navigate("/allquiz")}
              className="hover-cursorCSS p-2 px-4 bg-blue-500 text-white rounded-xl text-sm"
            >
              All Quizzes
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default SharedQuiz;

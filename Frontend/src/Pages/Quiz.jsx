import React, { useEffect, useReducer } from "react";
import axios from "axios";
import Loading from "../Components/QuizComponents/Loading";
import Error from "../Components/QuizComponents/Error";
import Question from "../Components/QuizComponents/Question";
import Finish from "../Components/QuizComponents/Finish";

const backend_base_url =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080/api/quiz"
    : "/api/quiz";

const initialState = { questions: [], status: "loading", index: 0, answer: null, score: 0, errorMsg: null };

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived": return { ...state, questions: action.payload, status: "ready", errorMsg: null };
    case "dataFailed":   return { ...state, status: "error", errorMsg: action.payload };
    case "start":        return { ...state, status: "active" };
    case "newAnswer": {
      const q = state.questions[state.index];
      return { ...state, answer: action.payload, score: action.payload === q.answer ? state.score + 1 : state.score };
    }
    case "nextQuestion": return { ...state, index: state.index + 1, answer: null };
    case "finish":       return { ...state, status: "finished" };
    case "restart":      return { ...initialState, questions: state.questions, status: "ready" };
    default: throw new Error("Unknown action");
  }
}

const Quiz = ({ topic }) => {
  const [{ questions, status, index, answer, score, errorMsg }, dispatch] = useReducer(reducer, initialState);
  const noOfQuest = questions.length;

  useEffect(() => {
    axios
      .get(`${backend_base_url}/getquizbytitle/${encodeURIComponent(topic)}`)
      .then((res) => {
        if (!res.data.quiz) throw new Error(res.data.msg || "Failed to fetch quiz");
        dispatch({ type: "dataReceived", payload: res.data.quiz.questions });
      })
      .catch((err) => dispatch({ type: "dataFailed", payload: err.response?.data?.msg || err.message }));
  }, [topic]);

  return (
    <section className="flex flex-col items-center min-h-[80vh] py-10 px-4 max-w-[640px] mx-auto w-full">
      {/* Topic header */}
      <h1 className="font-bold text-2xl sm:text-4xl tracking-tight text-black text-center mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
        {topic}
      </h1>

      {/* Progress */}
      {status !== "loading" && status !== "error" && (
        <>
          <progress className="w-full mb-2" max={noOfQuest} value={index + Number(answer !== null)} />
          <div className="w-full flex justify-between text-xs text-gray-400 px-1 mb-6">
            <span>Q {index + 1}/{noOfQuest}</span>
            <span>Score {score}/{noOfQuest}</span>
          </div>
        </>
      )}

      {status === "loading" && <Loading />}
      {status === "error"   && <Error errorMsg={errorMsg} />}

      {status === "ready" && (
        <button
          onClick={() => dispatch({ type: "start" })}
          className="hover-cursorCSS btn-primary mt-16 px-8 py-3 text-sm"
        >
          Start Quiz
        </button>
      )}

      {status === "active" && (
        <>
          <Question quest={questions[index]} dispatch={dispatch} answer={answer} />
          <div className="mt-8">
            {index < noOfQuest - 1 && answer !== null ? (
              <button onClick={() => dispatch({ type: "nextQuestion" })} className="hover-cursorCSS btn-secondary text-sm">
                Next Question →
              </button>
            ) : index === noOfQuest - 1 && answer !== null ? (
              <button onClick={() => dispatch({ type: "finish" })} className="hover-cursorCSS btn-primary text-sm">
                Finish Quiz
              </button>
            ) : null}
          </div>
        </>
      )}

      {status === "finished" && <Finish score={score * 10} maxScore={noOfQuest * 10} dispatch={dispatch} />}
    </section>
  );
};

export default Quiz;

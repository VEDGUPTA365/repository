import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const backend_base_url =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080/api/quiz"
    : "/api/quiz";

const GenerateQuizWithAI = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("easy");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const createQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", topic);
      formData.append("level", level);
      formData.append("noOfQuest", numberOfQuestions);
      if (file) formData.append("pdf", file);

      await axios.post(`${backend_base_url}/createquizusingai`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Quiz created!");
      navigate("/allquiz");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error creating quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[77vh] flexCenter px-4 bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="font-bold text-lg text-black tracking-tight">Generate Quiz with AI</h1>
          <p className="text-xs text-gray-400 mt-1">Enter a topic or upload a PDF to create questions instantly.</p>
        </div>

        <form onSubmit={createQuiz} className="px-6 py-5 flex flex-col gap-4">
          {/* Topic */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide" htmlFor="topic">
              Topic or Prompt
            </label>
            <textarea
              id="topic"
              value={topic}
              placeholder="e.g. World War II, Python basics, React hooks…"
              onChange={(e) => setTopic(e.target.value)}
              className="input-bw h-20 resize-none"
              required
            />
          </div>

          {/* PDF */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide" htmlFor="pdf">
              Upload PDF <span className="text-gray-300">(optional)</span>
            </label>
            <input
              type="file"
              id="pdf"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-gray-200 file:text-xs file:font-medium file:text-black file:bg-white hover:file:bg-gray-50 file:cursor-pointer"
            />
          </div>

          {/* Questions count */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide" htmlFor="numberOfQuestions">
              Questions <span className="text-gray-300">3 – 10</span>
            </label>
            <input
              type="number"
              id="numberOfQuestions"
              min={3} max={10}
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(e.target.value)}
              className="input-bw"
              required
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide" htmlFor="level">
              Difficulty
            </label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="input-bw"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`hover-cursorCSS btn-primary w-full mt-1 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Generating…" : "Create Quiz"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default GenerateQuizWithAI;

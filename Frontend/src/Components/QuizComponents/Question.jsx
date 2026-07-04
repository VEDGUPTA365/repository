import React from "react";

const Question = ({ quest, dispatch, answer }) => {
  const hasAns = answer !== null;

  return (
    <section className="w-full flex flex-col gap-4">
      <h2 className="text-center text-base sm:text-lg font-semibold text-black leading-snug px-2">
        {quest.question}
      </h2>

      <div className="flex flex-col gap-3 mt-2">
        {quest.options.map((option, i) => {
          const isSelected = i === answer;
          const isCorrect  = hasAns && i === quest.answer;
          const isWrong    = hasAns && isSelected && i !== quest.answer;

          return (
            <button
              key={i}
              onClick={() => dispatch({ type: "newAnswer", payload: i })}
              disabled={hasAns}
              className={`hover-cursorCSS w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150
                ${isCorrect ? "border-black bg-black text-white font-semibold" : ""}
                ${isWrong   ? "border-gray-300 bg-gray-50 text-gray-400 line-through" : ""}
                ${!hasAns   ? "border-gray-200 bg-white text-black hover:border-black" : ""}
                ${hasAns && !isCorrect && !isWrong ? "border-gray-100 bg-white text-gray-400" : ""}
              `}
            >
              <span className="font-mono text-xs text-gray-400 mr-3">{String.fromCharCode(65 + i)}.</span>
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Question;

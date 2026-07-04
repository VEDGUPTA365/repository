import React, { useState } from "react";

const features = [
  { icon: "✦", title: "AI-Generated Quizzes", description: "Pick any topic or upload a PDF — our AI instantly builds a custom quiz tailored to your content." },
  { icon: "⚔️", title: "Live 1v1 Battle", description: "Challenge a friend in real-time. Share a room code, answer simultaneously, and see who wins." },
  { icon: "🔗", title: "Share Quizzes", description: "Copy a link to any quiz and share it instantly. Anyone with an account can play." },
  { icon: "🔒", title: "Secure Authentication", description: "JWT-based login with cookie sessions. Your data stays safe and private." },
  { icon: "📊", title: "Instant Scoring", description: "See your score, accuracy, and correct answers immediately after finishing a quiz." },
];

const Features = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="py-20 px-6 w-full bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
            Everything you need
          </h2>
          <p className="text-gray-400 text-sm mt-3">Built for learners, creators, and competitors.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative p-6 bg-white border border-gray-200 rounded-xl transition-all duration-200 ${
                hoveredIndex !== null && hoveredIndex !== index
                  ? "opacity-40"
                  : "opacity-100 hover:shadow-md hover:-translate-y-1"
              }`}
            >
              <span className="text-2xl mb-4 block">{feature.icon}</span>
              <h3 className="font-bold text-black text-base mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
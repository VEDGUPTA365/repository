import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 text-center">
      <p className="text-sm font-bold tracking-tight text-black" style={{ fontFamily: "'Space Mono', monospace" }}>
        QuizBuddy
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Built by <span className="text-black font-medium">Ved Gupta</span> · {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;

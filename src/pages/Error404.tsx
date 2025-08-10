import React from "react";
import { Link } from "react-router-dom";

const Error404: React.FC = () => {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#071124] px-6 select-none">
      {/* Glowing pulse circle behind emoji */}
      <div className="absolute w-48 h-48 rounded-full bg-[#FA4B00]/30 dark:bg-[#f97316]/40 animate-glowPulse -z-10"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-md w-full">
        <div
          role="img"
          aria-label="Funny Japanese robot emoji"
          aria-live="polite"
          className="text-9xl mb-8 animate-floatRotate"
        >
          🎌
        </div>
        <h1 className="text-6xl font-extrabold text-[#FA4B00] dark:text-[#f97316] mb-4">
          404
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          おっと！このページは迷子になっちゃったみたい。<br />
          (Oops! Looks like this page got lost on its way.)
        </p>

        {/* Funny under development note */}
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6">
          🚧 Under development — our hardworking Japanese robots 🤖 are still
          learning hiragana before they can finish this page! 🥢🍣
        </p>

        {/* Back to home button */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#FA4B00] to-[#f97316] text-white font-semibold shadow-lg hover:from-[#e03e00] hover:to-[#c26012] transition-colors duration-300"
        >
          ホームに戻る (Take me home)
        </Link>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes floatRotate {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(15deg); }
        }
        .animate-floatRotate {
          animation: floatRotate 3s ease-in-out infinite;
          display: inline-block;
          will-change: transform;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .animate-glowPulse {
          animation: glowPulse 4s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
};

export default Error404;

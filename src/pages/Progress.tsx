import React, { useEffect, useState, useMemo } from "react";

const QUOTES = [
  "Keep going, you're doing great!",
  "Practice makes perfect!",
  "Every character mastered is a step closer to fluency.",
  "Consistency is the key to success.",
  "Mistakes are proof you're trying!",
  "Small progress is still progress.",
];

const Progress: React.FC = () => {
  const getScore = (key: string) => {
    if (typeof window === "undefined") return 0;
    const raw = localStorage.getItem(key);
    return raw ? parseInt(raw, 10) : 0;
  };

  const [hiraganaScore, setHiraganaScore] = useState(() => getScore("hiraganaScore"));
  const [katakanaScore, setKatakanaScore] = useState(() => getScore("katakanaScore"));
  const [kanjiScore, setKanjiScore] = useState(() => getScore("kanjiScore"));
  const [confettiActive, setConfettiActive] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [quote, setQuote] = useState(() => {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
  });

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "hiraganaScore") setHiraganaScore(getScore("hiraganaScore"));
      if (e.key === "katakanaScore") setKatakanaScore(getScore("katakanaScore"));
      if (e.key === "kanjiScore") setKanjiScore(getScore("kanjiScore"));
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const maxScore = 100;
  const hiraganaPercent = Math.min((hiraganaScore / maxScore) * 100, 100);
  const katakanaPercent = Math.min((katakanaScore / maxScore) * 100, 100);
  const kanjiPercent = Math.min((kanjiScore / maxScore) * 100, 100);

  const resetProgress = () => {
    localStorage.removeItem("hiraganaScore");
    localStorage.removeItem("katakanaScore");
    localStorage.removeItem("kanjiScore");
    setHiraganaScore(0);
    setKatakanaScore(0);
    setKanjiScore(0);
    setConfettiActive(true);
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    setShowResetModal(false);

    setTimeout(() => setConfettiActive(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-sky-100 to-indigo-200 dark:from-indigo-900 dark:to-sky-900 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center select-none">
          Progress Dashboard
        </h1>

        <blockquote
          className="text-center italic text-gray-700 dark:text-gray-300 mb-10 opacity-90 select-none animate-fadeIn"
          style={{ fontSize: "1.2rem" }}
        >
          &ldquo;{quote}&rdquo;
        </blockquote>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section
            className="bg-sky-50 dark:bg-indigo-800 p-6 rounded-xl shadow-md flex flex-col items-center select-none
            transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-sky-900 dark:text-sky-300 mb-4">Hiragana</h2>
            <div className="text-6xl mb-4 text-[#12315a] dark:text-sky-200 font-extrabold">あ</div>
            <p className="text-lg font-semibold text-sky-800 dark:text-sky-300 mb-6">
              Score: {hiraganaScore} / {maxScore}
            </p>

            <div className="w-full bg-sky-200 dark:bg-indigo-700 rounded-full h-6 overflow-hidden shadow-inner">
              <div
                className="h-full bg-sky-600 dark:bg-sky-400 transition-all duration-700 ease-out"
                style={{ width: `${hiraganaPercent}%` }}
              />
            </div>

            <p className="mt-4 text-center text-sky-700 dark:text-sky-300 font-medium">
              Keep practicing to master all Hiragana characters!
            </p>
          </section>

          <section
            className="bg-pink-50 dark:bg-pink-900 p-6 rounded-xl shadow-md flex flex-col items-center select-none
            transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-pink-700 dark:text-pink-300 mb-4">Katakana</h2>
            <div className="text-6xl mb-4 text-pink-800 dark:text-pink-300 font-extrabold">ア</div>
            <p className="text-lg font-semibold text-pink-800 dark:text-pink-300 mb-6">
              Score: {katakanaScore} / {maxScore}
            </p>

            <div className="w-full bg-pink-200 dark:bg-pink-700 rounded-full h-6 overflow-hidden shadow-inner">
              <div
                className="h-full bg-pink-600 dark:bg-pink-400 transition-all duration-700 ease-out"
                style={{ width: `${katakanaPercent}%` }}
              />
            </div>

            <p className="mt-4 text-center text-pink-700 dark:text-pink-300 font-medium">
              Keep practicing to master all Katakana characters!
            </p>
          </section>
          <section
            className="bg-green-50 dark:bg-green-900 p-6 rounded-xl shadow-md flex flex-col items-center select-none
            transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl" >
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">Kanji</h2>
            <div className="text-6xl mb-4 text-green-800 dark:text-green-300 font-extrabold">時</div>
            <p className="text-lg font-semibold text-green-800 dark:text-green-300 mb-6">
              Score: {kanjiScore} / {maxScore}
            </p>
            <div className="w-full bg-green-200 dark:bg-green-700 rounded-full h-6 overflow-hidden shadow-inner">
              <div
                className="h-full bg-green-600 dark:bg-green-400 transition-all duration-700 ease-out"
                style={{ width: `${kanjiPercent}%` }}
              />
            </div>

              <p className="mt-4 text-center text-green-800 dark:text-green-300 font-medium">
              Keep practicing to master all Kanji characters!
            </p>
            
          </section>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowResetModal(true)}
            className="px-8 py-3 rounded-full bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-400 focus:outline-none
            text-white font-semibold shadow-lg transition-colors duration-300 select-none"
            aria-label="Reset progress"
          >
            Reset Progress
          </button>
        </div>

        <div className="mt-14 text-center text-gray-600 dark:text-gray-400 italic select-none">
          📊 Charts coming soon...
        </div>

        {confettiActive && <Confetti />}

        {/* Reset Confirmation Modal */}
        {showResetModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-modal-title"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full p-6 shadow-lg text-center">
              <h3
                id="reset-modal-title"
                className="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
              >
                Confirm Reset Progress
              </h3>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to reset your progress? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-6">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-6 py-2 rounded-md border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={resetProgress}
                  className="px-6 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-400
                    transition-colors duration-200 font-semibold"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Confetti: React.FC = () => {
  const confettiPieces = useMemo(() => {
    const colors = ["#FF7AA3", "#FFAEC2", "#FFD6DE", "#FF7AA3", "#FFB6C1"];
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: Math.random() * 100,
      delay: Math.random() * 1500,
      size: Math.random() * 10 + 5,
      duration: 3000 + Math.random() * 2000,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-visible z-50">
      {confettiPieces.map(({ id, color, left, delay, size, duration }) => (
        <span
          key={id}
          className="absolute rounded-full opacity-90"
          style={{
            backgroundColor: color,
            width: size,
            height: size,
            left: `${left}vw`,
            top: -size,
            animation: `fall ${duration}ms ease-in forwards`,
            animationDelay: `${delay}ms`,
          }}
        />
      ))}

      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
        }
        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(10px);}
          to {opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default Progress;

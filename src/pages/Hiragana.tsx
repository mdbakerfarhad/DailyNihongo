import React, { useEffect, useMemo, useState } from "react";
import hiraganaDataRaw from "../data/hiragana.json";

type KanaItem = {
  char: string;
  romaji: string;
};

const hiraganaData: KanaItem[] = hiraganaDataRaw as KanaItem[];

/** play a tiny tone for feedback (Web Audio API) */
function playTone(freq = 440, duration = 0.08) {
  try {
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as any;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.value = 0.05;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, duration * 3000);
  } catch {
    /* ignore audio errors */
  }
}

const getRandomIndex = (max: number, avoid?: number) => {
  if (max <= 1) return 0;
  let next = Math.floor(Math.random() * max);
  if (typeof avoid === "number" && next === avoid) next = (avoid + 1) % max;
  return next;
};

const STORAGE_KEY = "hiraganaScore";

const Hiragana: React.FC = () => {
  const [index, setIndex] = useState<number>(() => Math.floor(Math.random() * hiraganaData.length));
  const [input, setInput] = useState<string>("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState<number>(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return raw ? parseInt(raw, 10) : 0;
  });
  const [reverse, setReverse] = useState<boolean>(false);
  const [confettiActive, setConfettiActive] = useState(false);

  // NEW: show feedback inside buttons area on mobile for 10 seconds after checking
  const [showFeedbackInButtonsArea, setShowFeedbackInButtonsArea] = useState(false);

  const item = useMemo(() => hiraganaData[index], [index]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(score));
    } catch {}
  }, [score]);

  useEffect(() => {
    if (feedback === "correct") {
      setConfettiActive(true);
      const timeout = setTimeout(() => setConfettiActive(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [feedback]);

  const checkAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const normalized = input.trim().toLowerCase();
    if (!normalized) return;

    const isMobile = window.matchMedia("(max-width: 639px)").matches; // sm breakpoint

    if (!reverse) {
      if (normalized === item.romaji.toLowerCase()) {
        setFeedback("correct");
        setScore((s) => s + 1);
        playTone(880, 0.1);
      } else {
        setFeedback("wrong");
        playTone(220, 0.15);
      }
    } else {
      if (normalized === item.char) {
        setFeedback("correct");
        setScore((s) => s + 1);
        playTone(880, 0.1);
      } else {
        setFeedback("wrong");
        playTone(220, 0.15);
      }
    }

    if (isMobile) {
      setShowFeedbackInButtonsArea(true);
      setTimeout(() => {
        setShowFeedbackInButtonsArea(false);
        setInput("");
        setFeedback(null);
        setIndex((i) => getRandomIndex(hiraganaData.length, i));
      }, 1500); // 10 seconds
    } else {
      setTimeout(() => {
        setInput("");
        setFeedback(null);
        setIndex((i) => getRandomIndex(hiraganaData.length, i));
      }, 1500);
    }
  };

  const skip = () => {
    setFeedback(null);
    setInput("");
    setIndex((i) => getRandomIndex(hiraganaData.length, i));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-20 min-h-screen flex flex-col">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3 sm:gap-0">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white select-none">
          Hiragana Practice
        </h2>
        <div className="text-lg sm:text-xl text-gray-700 dark:text-gray-300">
          Score: <span className="font-bold text-sakura-500 dark:text-sakura-300">{score}</span>
        </div>
      </header>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col">
        {/* Character and toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <div className="text-center flex-1 select-none">
            <div
              className={`text-[7rem] sm:text-[9rem] font-extrabold mb-2 text-[#12315a] dark:text-white drop-shadow-lg`}
              aria-label="Hiragana character to practice"
            >
              {item.char}
            </div>
            <div className="text-base sm:text-lg font-medium text-gray-900 dark:text-white select-text">
              {reverse ? (
                <>
                  Type the <span className="font-semibold">kana character</span> shown below
                </>
              ) : (
                <>
                  Type the <span className="font-semibold">romaji</span> for this character
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label
              htmlFor="reverseToggle"
              className="flex items-center gap-2 cursor-pointer select-none text-gray-900 dark:text-white text-sm sm:text-base font-medium"
            >
              <input
                id="reverseToggle"
                type="checkbox"
                checked={reverse}
                onChange={() => setReverse((r) => !r)}
                className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-sakura-500 focus:ring-sakura-400 dark:focus:ring-sakura-600"
              />
              Reverse (romaji → kana)
            </label>
          </div>
        </div>

        {/* Form input and buttons / feedback */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            checkAnswer();
          }}
          className="flex flex-row items-center gap-4 flex-wrap"
        >
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={reverse ? "Type the character (copy/paste OK)" : "Type romaji (a, ka, shi...)"}
            className={`
              flex-1 px-5 py-4 rounded-lg border text-gray-900 dark:text-white
              bg-white dark:bg-[#041826] outline-none
              transition-colors duration-300 ease-in-out
              border-gray-300 dark:border-gray-700
              focus:border-sakura-500 focus:ring-2 focus:ring-sakura-300 dark:focus:ring-sakura-600
              ${feedback === "correct" ? "border-green-400 bg-green-50 dark:bg-green-900" : ""}
              ${feedback === "wrong" ? "border-red-400 bg-red-50 dark:bg-red-900" : ""}
              text-lg sm:text-xl
            `}
            spellCheck={false}
            disabled={showFeedbackInButtonsArea} // disable input when feedback in buttons area on mobile
          />

          {showFeedbackInButtonsArea ? (
            <div
              role="alert"
              className={`
                px-6 py-4 rounded-lg font-semibold text-center text-lg
                ${feedback === "correct"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : ""}
                ${feedback === "wrong"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  : ""}
              `}
              style={{ minWidth: "120px" }} // approx button width
            >
              {feedback === "correct" ? (
                <>🎉 Correct! Great job!</>
              ) : (
                <>❌ Wrong — answer: {!reverse ? item.romaji : item.char}</>
              )}
            </div>
          ) : (
            <>
              <button
                type="submit"
                className="px-6 py-4 rounded-lg bg-sakura-500 text-white dark:text-gray-900 bg-gray-700 dark:bg-gray-200 font-semibold text-lg shadow-lg
                  hover:bg-sakura-600 dark:hover:bg-sakura-400
                  focus:outline-none focus:ring-4 focus:ring-sakura-400 dark:focus:ring-sakura-600 transition-colors duration-300"
                aria-label="Check answer"
              >
                Check
              </button>
              <button
                type="button"
                onClick={skip}
                className="px-6 py-4 rounded-lg bg-sakura-500 text-white dark:text-gray-900 bg-gray-700 dark:bg-gray-200 font-semibold text-lg shadow-lg
                  hover:bg-sakura-600 dark:hover:bg-sakura-400
                  focus:outline-none focus:ring-4 focus:ring-sakura-400 dark:focus:ring-sakura-600 transition-colors duration-300"
                aria-label="Skip character"
              >
                Skip
              </button>
            </>
          )}
        </form>

        {/* Feedback message below form on desktop only */}
        {!showFeedbackInButtonsArea && feedback && (
          <div
            role="alert"
            className={`
              mt-6 p-4 rounded-lg font-semibold text-center
              text-lg
              ${feedback === "correct" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : ""}
              ${feedback === "wrong" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" : ""}
              animate-fadeIn
              select-none
              hidden sm:block
              `}
          >
            {feedback === "correct" ? (
              <>🎉 Correct! Great job!</>
            ) : (
              <>❌ Wrong — answer: {!reverse ? item.romaji : item.char}</>
            )}
          </div>
        )}

        {/* Score progress bar */}
        <div className="mt-8">
          <div className="h-1 w-auto bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-sakura-500 dark:bg-sakura-400 transition-all duration-500 ease-out"
              style={{ width: `${Math.min(score * 4, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400 select-none">
            Keep going! Aim for 25 points to master all.
          </p>
        </div>

        {/* Tip */}
        <div className="mt-10 pt-2 pb-3 text-center text-sm text-gray-500 dark:text-gray-400 select-none bg-transparent">
          Tip: Try short bursts (5–10 mins). Progress auto-saves.
        </div>
      </div>

      {/* --- Hiragana Chart Grid --- */}
      <section className="mt-16">
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white select-none">
          Learn Hiragana
        </h3>
        <div className="grid grid-cols-5 gap-6">
          {hiraganaData.map(({ char, romaji }, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center rounded-lg p-4 bg-gray-100 dark:bg-gray-700 shadow-md select-none"
            >
              <span className="text-5xl sm:text-6xl font-extrabold mb-2 text-[#12315a] dark:text-white">
                {char}
              </span>
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-300">
                {romaji}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Confetti effect */}
      {confettiActive && <Confetti />}
    </div>
  );
};

// Simple confetti effect using small colored circles falling
const Confetti: React.FC = () => {
  // Generate some confetti pieces with random positions and delays
  const confettiPieces = useMemo(() => {
    const colors = ["#FF7AA3", "#FFAEC2", "#FFD6DE", "#FF7AA3", "#FFB6C1"];
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: Math.random() * 100,
      delay: Math.random() * 1500,
      size: Math.random() * 8 + 4,
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

export default Hiragana;

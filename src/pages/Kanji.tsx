import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import kanjiDataRaw from "../data/kanji.json";

type KanjiItem = {
  char: string;
  romaji: string;
  meaning: string;
};

const kanjiData: KanjiItem[] = kanjiDataRaw as KanjiItem[];

const ITEMS_PER_PAGE = 40;
const STORAGE_KEY = "kanjiScore";

const KanjiPractice: React.FC = () => {
  const [index, setIndex] = useState<number>(() => Math.floor(Math.random() * kanjiData.length));
  const [input, setInput] = useState<string>("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? parseInt(raw, 10) : 0;
      return isNaN(parsed) ? 0 : parsed;
    } catch {
      return 0;
    }
  });
  // Removed reverse checkbox entirely, but kept the state in case you want to re-add later
  const [reverse] = useState<boolean>(false);
  const [confettiActive, setConfettiActive] = useState<boolean>(false);
  const [showFeedbackInButtonsArea, setShowFeedbackInButtonsArea] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  // New: add a checkMode state to choose between "meaning" and "romaji"
  const [checkMode, setCheckMode] = useState<"meaning" | "romaji">("meaning");

  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(score));
    } catch {}
  }, [score]);

  const playTone = (freq = 440, duration = 0.08) => {
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
      const id = window.setTimeout(() => {
        o.stop();
        ctx.close();
      }, duration * 1000);
      timersRef.current.push(id);
    } catch {}
  };

  const getRandomIndex = (max: number, avoid?: number) => {
    if (max <= 1) return 0;
    let next = Math.floor(Math.random() * max);
    if (typeof avoid === "number" && next === avoid) next = (avoid + 1) % max;
    return next;
  };

  const checkAnswer = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const normalized = input.trim().toLowerCase();
      if (!normalized) return;

      const item = kanjiData[index];
      let isCorrect = false;

      if (!reverse) {
        if (checkMode === "meaning") {
          const meanings = item.meaning
            .toLowerCase()
            .split(";")
            .map((m) => m.trim());
          isCorrect = meanings.includes(normalized);
        } else if (checkMode === "romaji") {
          const romajis = item.romaji
            .toLowerCase()
            .split(";")
            .map((r) => r.trim());
          isCorrect = romajis.includes(normalized);
        }
      } else {
        isCorrect = normalized === item.char;
      }

      setFeedback(isCorrect ? "correct" : "wrong");

      if (isCorrect) {
        setScore((s) => s + 1);
        playTone(880, 0.1);
        setConfettiActive(true);
        const tid = window.setTimeout(() => setConfettiActive(false), 1500);
        timersRef.current.push(tid);
      } else {
        playTone(220, 0.15);
      }

      const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;

      if (isMobile) {
        setShowFeedbackInButtonsArea(true);
        const tid = window.setTimeout(() => {
          setShowFeedbackInButtonsArea(false);
          setInput("");
          setFeedback(null);
          setIndex((i) => getRandomIndex(kanjiData.length, i));
        }, 1500);
        timersRef.current.push(tid);
      } else {
        const tid = window.setTimeout(() => {
          setInput("");
          setFeedback(null);
          setIndex((i) => getRandomIndex(kanjiData.length, i));
        }, 1500);
        timersRef.current.push(tid);
      }
    },
    [input, index, reverse, checkMode]
  );

  const skip = useCallback(() => {
    setFeedback(null);
    setInput("");
    setIndex((i) => getRandomIndex(kanjiData.length, i));
  }, []);

  const item = kanjiData[index];

  // Prepare pagination
  const totalPages = Math.ceil(kanjiData.length / ITEMS_PER_PAGE);
  const pageData = useMemo(() => {
    const start = page * ITEMS_PER_PAGE;
    return kanjiData.slice(start, start + ITEMS_PER_PAGE);
  }, [page]);

  // Confetti effect
  const Confetti: React.FC = () => {
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
        `}</style>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="mb-6 flex flex-col sm:flex-row justify-center items-center gap-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight select-none">
          Kanji Practice (N5)
        </h1>        
      </header>

      {/* New: Check Mode Select */}
<label className="flex flex-col sm:flex-row justify-center items-center sm:space-x-3 select-none cursor-pointer mb-4">
  <span className="text-md sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
    Verify the Kanji by its{" "}
    <span className="text-red-600 dark:text-red-400 underline decoration-wavy decoration-red-400 dark:decoration-red-300">
      Meaning
    </span>{" "}
    or{" "}
    <span className="text-blue-600 dark:text-blue-400 underline decoration-wavy decoration-blue-400 dark:decoration-blue-300">
      Romaji
    </span>
    :
  </span>
  <select
    value={checkMode}
    onChange={(e) => setCheckMode(e.target.value as "meaning" | "romaji")}
    className="
      mt-1 sm:mt-0
      ml-0 sm:ml-2
      px-3 py-1.5
      rounded-md
      font-semibold
      text-md sm:text-lg
      bg-gradient-to-r from-red-500 to-pink-500 dark:from-red-700 dark:to-pink-700
      text-white
      border-2 border-transparent
      shadow-md
      hover:border-white hover:shadow-lg
      focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-pink-600
      transition
      duration-200
      ease-in-out
      cursor-pointer
      min-w-[100px]
    "
    aria-label="Select check mode: meaning or romaji"
  >
    <option value="meaning" className="text-black">
      Meaning
    </option>
    <option value="romaji" className="text-black">
      Romaji
    </option>
  </select>
</label>

      {/* Quiz Box */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col max-w-3xl mx-auto mb-10">
        <div className="text-center mb-6 select-none">
          <div className="text-[6rem] sm:text-[8rem] font-extrabold text-[#12315a] dark:text-white drop-shadow-lg">
            {item.char}
          </div>
          <div className="text-lg sm:text-xl font-semibold">
            {reverse ? (
              <>Type the <span className="underline decoration-wavy">Kanji character</span> shown above</>
            ) : (
              <>Type the <span className="underline decoration-wavy">{checkMode}</span> of this kanji</>
            )}
          </div>
        </div>

        <form
          onSubmit={checkAnswer}
          className="flex flex-col sm:flex-row gap-4 items-center"
          noValidate
          spellCheck={false}
        >
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={reverse ? "Type kanji character" : `Type ${checkMode}`}
            className={`flex-grow px-5 py-4 rounded-lg border
              border-gray-300 dark:border-gray-700
              bg-white dark:bg-[#041826]
              text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-sakura-400 dark:focus:ring-sakura-600
              text-lg sm:text-xl
              ${
                feedback === "correct"
                  ? "border-green-400 bg-green-50 dark:bg-green-900"
                  : ""
              }
              ${
                feedback === "wrong"
                  ? "border-red-400 bg-red-50 dark:bg-red-900"
                  : ""
              }
            `}
            disabled={showFeedbackInButtonsArea}
          />

          {showFeedbackInButtonsArea ? (
            <div
              className={`px-6 py-4 rounded-lg font-semibold text-center text-lg
                ${
                  feedback === "correct"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : ""
                }
                ${
                  feedback === "wrong"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    : ""
                }
              `}
              style={{ minWidth: "140px" }}
            >
              {feedback === "correct" ? (
                <>🎉 Correct! Great job!</>
              ) : (
                <>
                  ❌ Wrong — Correct Answer:{" "}
                  <span className="whitespace-nowrap">
  {`${item.romaji} ~~ ${item.meaning}`}
</span>
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
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
            </div>
          )}
        </form>

        {!showFeedbackInButtonsArea && feedback && (
          <div
            className={`mt-6 p-4 rounded-lg font-semibold text-center
              text-lg
              ${feedback === "correct" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : ""}
              ${feedback === "wrong" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" : ""}
              animate-fadeIn select-none hidden sm:block`}
          >
            {feedback === "correct" ? (
              <>🎉 Correct! Great job!</>
            ) : (
              <>
                ❌ Wrong — Correct Answer:{" "}
                <span className="whitespace-nowrap">
{`${item.romaji} ~~ ${item.meaning}`}
</span>
              </>
            )}
          </div>
        )}
        
        <div className="mt-8">
          <div className="h-1 w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-sakura-500 dark:bg-sakura-400 transition-all duration-500 ease-out"
              style={{ width: `${Math.min(score * 4, 100)}%` }}
            />
          </div>
          <div className="text-lg font-semibold select-none flex items-center gap-2">
  <span>Score:</span>
  <span className="text-sakura-500 dark:text-sakura-300 font-extrabold drop-shadow-md">
    {score}
  </span>
</div>
          <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400 select-none">
            Keep going! Aim for 25 points to master all.
          </p>
        </div>

       <div className="mt-10 pt-2 pb-3 text-center text-sm italic text-gray-600 dark:text-gray-400 select-none bg-transparent">
  Tip: Type on Kanji below to check meaning or romaji.
</div>
      </section>

      {/* Dropdown to select page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <label htmlFor="kanji-page" className="block mb-2 font-semibold text-lg">
          Select Kanji Group:
        </label>
        <select
          id="kanji-page"
          value={page}
          onChange={(e) => setPage(Number(e.target.value))}
          className="rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sakura-400 dark:focus:ring-sakura-600"
        >
          {Array.from({ length: totalPages }).map((_, i) => {
            const startNum = i * ITEMS_PER_PAGE + 1;
            const endNum = Math.min((i + 1) * ITEMS_PER_PAGE, kanjiData.length);
            return (
              <option key={i} value={i}>
                {`Kanji ${startNum} - ${endNum}`}
              </option>
            );
          })}
        </select>
      </div>

      {/* Kanji chart grid */}
      <section className="max-w-7xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div
          className="grid grid-cols-3 sm:grid-cols-8 gap-4"
          style={{ maxHeight: "600px", overflowY: "auto" }}
        >
          {pageData.map(({ char, romaji, meaning }, idx) => (
            <div
              key={`${char}-${idx}`}
              className={`cursor-default rounded-lg border border-gray-300 dark:border-gray-700
                p-3 text-center select-none
                ${
                  kanjiData[index].char === char
                    ? "bg-sakura-100 dark:bg-sakura-700 font-semibold"
                    : "hover:bg-sakura-50 dark:hover:bg-sakura-900"
                }
              `}
              title={`${meaning} / ${romaji}`}
              onClick={() => {
                // Clicking a kanji sets quiz to that item
                const actualIndex = page * ITEMS_PER_PAGE + idx;
                setIndex(actualIndex);
                setInput("");
                setFeedback(null);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  const actualIndex = page * ITEMS_PER_PAGE + idx;
                  setIndex(actualIndex);
                  setInput("");
                  setFeedback(null);
                }
              }}
            >
              <div className="text-3xl sm:text-4xl mb-1">{char}</div>
              <div className="text-xs text-gray-700 dark:text-gray-300">{romaji}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 truncate" title={meaning}>
                {meaning}
              </div>
            </div>
          ))}
        </div>
      </section>

      {confettiActive && <Confetti />}
    </div>
  );
};

export default KanjiPractice;

import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import grammarDataRaw from "../data/grammar-n5.json";

type Example = {
  japanese: string;
  romaji: string;
  english: string;
  answer: string;
  answerRomaji: string;
  answerEnglish: string;
};

type Rule = {
  ruleNumber: number;
  title: string;
  description: string;
  examples: Example[];
  note?: string;
};

type Lesson = {
  lesson: number;
  rules: Rule[];
};

// Raw JSON types (match the JSON file)
type ExampleRaw = {
  japanese: string;
  romaji: string;
  english: string;
  answer?: string;
  answerRomaji?: string;
  answerEnglish?: string;
};

type RuleRaw = {
  ruleNumber: number;
  title: string;
  description?: string;
  examples: ExampleRaw[];
  note?: string;
};

type LessonRaw = {
  lesson: number;
  rules: RuleRaw[];
};

// Preprocess grammar data safely
const grammarData: Lesson[] = (grammarDataRaw as LessonRaw[]).map((lesson) => ({
  lesson: lesson.lesson,
  rules: lesson.rules.map((rule) => ({
    ruleNumber: rule.ruleNumber,
    title: rule.title,
    description: rule.description ?? "",
    examples: rule.examples.map((ex) => ({
      japanese: ex.japanese,
      romaji: ex.romaji,
      english: ex.english,
      answer: ex.answer ?? "",
      answerRomaji: ex.answerRomaji ?? "",
      answerEnglish: ex.answerEnglish ?? "",
    })) as Example[],
    note: rule.note,
  })),
}));

const GrammarPage: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<number>(1);
  const [openRuleNumber, setOpenRuleNumber] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOpen = (ruleNumber: number) => {
    setOpenRuleNumber(openRuleNumber === ruleNumber ? null : ruleNumber);
  };

  const selectedLessonData = grammarData.find((l) => l.lesson === selectedLesson);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen px-2 sm:px-4 md:px-8 py-8 md:py-12 text-gray-900 dark:text-gray-100 flex flex-col items-center gap-10">

      {/* Grammar Box */}
      <div className="w-full max-w-4xl p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-900 dark:border-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">
          Japanese Grammar - N5
        </h1>

        {/* Custom Dropdown */}
        <div className="relative mb-6 sm:mb-8 flex justify-center" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-48 px-4 py-2 rounded border border-indigo-400 dark:border-indigo-600 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 flex justify-between items-center"
          >
            <span>Lesson {selectedLesson}</span>
            <FiChevronDown
              className={`ml-2 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
              size={20}
            />
          </button>

          <div
            className={`absolute z-50 mt-1 w-48 max-h-64 overflow-y-auto rounded border border-indigo-400 dark:border-indigo-600 bg-white dark:bg-gray-900 shadow-lg scrollbar-thin scrollbar-thumb-indigo-500 dark:scrollbar-thumb-indigo-700 scrollbar-track-gray-200 dark:scrollbar-track-indigo-900
              transition-all duration-300 ease-in-out
              ${dropdownOpen ? "opacity-100 max-h-64" : "opacity-0 max-h-0 pointer-events-none"}`}
          >
            <ul>
              {grammarData.map((lesson) => (
                <li
                  key={lesson.lesson}
                  onClick={() => {
                    setSelectedLesson(lesson.lesson);
                    setDropdownOpen(false);
                    setOpenRuleNumber(null);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-800 text-gray-900 dark:text-white"
                >
                  Lesson {lesson.lesson}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Rules list */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8 max-h-[60vh] overflow-y-auto">
          {!selectedLessonData && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No data available for this lesson.
            </p>
          )}

          {selectedLessonData?.rules.map(({ ruleNumber, title, description, examples, note }) => (
            <section
              key={ruleNumber}
              className="border border-gray-900 dark:border-white rounded-lg shadow-md"
              aria-labelledby={`rule-title-${ruleNumber}`}
            >
              <button
                onClick={() => toggleOpen(ruleNumber)}
                className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center dark:text-white"
                aria-expanded={openRuleNumber === ruleNumber}
                aria-controls={`rule-panel-${ruleNumber}`}
                id={`rule-title-${ruleNumber}`}
              >
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">{title}</h2>
                <span className="text-gray-900 dark:text-white font-bold text-2xl sm:text-3xl md:text-3xl leading-none select-none">
                  {openRuleNumber === ruleNumber ? "−" : "+"}
                </span>
              </button>

              {openRuleNumber === ruleNumber && (
                <div
                  id={`rule-panel-${ruleNumber}`}
                  className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 text-gray-800 dark:text-gray-200 space-y-3 sm:space-y-4"
                  role="region"
                  aria-labelledby={`rule-title-${ruleNumber}`}
                  tabIndex={0}
                >
                  <p className="whitespace-pre-line text-sm sm:text-base md:text-base">{description}</p>

                  <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base md:text-lg">
                    Example Sentences:
                  </h3>
                  <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                    {examples.map(({ japanese, romaji, english, answer, answerRomaji, answerEnglish }, idx) => (
                      <li
                        key={idx}
                        className="bg-gray-600 dark:bg-indigo-100  p-3 sm:p-4 rounded-md shadow-sm"
                      >
                        <p className="text-sm sm:text-base md:text-lg font-medium text-white dark:text-gray-900"><span className="text-[#ffbb00] dark:text-[#ff00c8]">Japanese:</span> {japanese}</p>
                        <p className="italic text-xs sm:text-sm md:text-base text-white dark:text-gray-900 mb-1"><span className="text-[#ffbb00] dark:text-[#ff00c8]">Romaji:</span> {romaji}</p>
                        <p className="text-sm sm:text-base md:text-base text-white dark:text-gray-900"><span className="text-[#ffbb00] dark:text-[#ff00c8]">English:</span> {english}</p>
                        {answer && (
                          <div className="mt-2 p-2 sm:p-3 bg-green-100 dark:bg-green-800 rounded border-l-4 border-green-500 dark:border-green-400 text-xs sm:text-sm md:text-base">
                            <strong>Answer:</strong> {answer} ({answerRomaji} / {answerEnglish})
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  {note && (
                    <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-400 text-xs sm:text-sm md:text-base">
                      <strong>Note:</strong> {note}
                    </div>
                  )}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      {/* PDF Box */}
      <div className="w-full max-w-4xl p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-900 dark:border-white">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4 text-center dark:text-white">
          Japanese Grammar Bangla PDF
        </h2>

        <div className="w-full min-h-[400px] h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-auto">
          <object
            data="/Japanese Grammar Bangla PDF.pdf"
            type="application/pdf"
            width="100%"
            height="100%"
          >
            <button className="text-center dark:text-white">
              PDF cannot be displayed. <br />
              <a href="/Japanese Grammar Bangla PDF.pdf" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">
                Download PDF
              </a>
            </button>
          </object>
        </div>
      </div>
    </div>
  );
};

export default GrammarPage;

import React, { useState, useMemo } from "react";
import vocabDataRaw from "../data/n5_vocab.json";

type Word = {
  nihongo: string;
  romaji: string;
  english: string;
  bangla: string;
};

type LessonData = {
  lesson: number;
  words: Word[];
};

const vocabData: LessonData[] = vocabDataRaw as LessonData[];

type SortConfig = {
  column: keyof Word | null;
  direction: "asc" | "desc" | null;
};

const VocabularyPractice: React.FC = () => {
  const [lesson, setLesson] = useState<number>(1);

  // Control visibility of each column
  const [visibleCols, setVisibleCols] = useState<Record<keyof Word, boolean>>({
    romaji: true,
    nihongo: true,
    english: true,
    bangla: true,
  });

  const toggleColumn = (col: keyof Word) => {
    setVisibleCols((prev) => ({
      ...prev,
      [col]: !prev[col],
    }));
  };

  const currentWords = useMemo(() => {
    return vocabData.find((l) => l.lesson === lesson)?.words || [];
  }, [lesson]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: null,
    direction: null,
  });

  const sortedWords = useMemo(() => {
    if (!sortConfig.column || !sortConfig.direction) return currentWords;

    const sorted = [...currentWords].sort((a, b) => {
      const col = sortConfig.column!;
      const valA = a[col] || "";
      const valB = b[col] || "";

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [currentWords, sortConfig]);

  const handleSort = (col: keyof Word) => {
    setSortConfig((prev) => {
      if (prev.column !== col) {
        return { column: col, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { column: col, direction: "desc" };
      }
      return { column: null, direction: null };
    });
  };

  const renderSortArrow = (col: keyof Word) => {
    if (sortConfig.column !== col) return null;
    if (sortConfig.direction === "asc")
      return (
        <span aria-label="ascending" className="inline-block ml-1 select-none">
          ▲
        </span>
      );
    if (sortConfig.direction === "desc")
      return (
        <span aria-label="descending" className="inline-block ml-1 select-none">
          ▼
        </span>
      );
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">N5 Vocabulary Practice</h1>

      {/* Lesson Selector */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label htmlFor="lesson" className="font-semibold">
          Select Lesson:
        </label>
        <select
          id="lesson"
          value={lesson}
          onChange={(e) => setLesson(Number(e.target.value))}
          className="border rounded px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          {vocabData.map((l) => (
            <option key={l.lesson} value={l.lesson}>
              Lesson {l.lesson}
            </option>
          ))}
        </select>
      </div>

      {/* Vocabulary Table */}
      <div className="overflow-x-auto border border-gray-300 dark:border-gray-700 rounded-lg">
        <table className="w-full min-w-[600px] border-collapse border border-gray-300 dark:border-gray-700 text-sm sm:text-base">
          <thead className="bg-gray-200 dark:bg-gray-800 select-none">
            <tr>
              <th className="border p-2 sticky left-0 bg-gray-200 dark:bg-gray-800 z-10 text-center whitespace-nowrap">
                #
              </th>

              {(["romaji", "nihongo", "english", "bangla"] as (keyof Word)[]).map(
                (col) => (
                  <th
                    key={col}
                    className="border p-2 text-left whitespace-nowrap"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleSort(col)}
                        className="font-semibold flex items-center space-x-1 text-gray-900 dark:text-gray-100 hover:underline focus:outline-none"
                        aria-label={`Sort by ${col} column`}
                      >
                        <span className="capitalize">{col}</span>
                        {renderSortArrow(col)}
                      </button>

                      <button
                        onClick={() => toggleColumn(col)}
                        className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600
                          focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label={`${visibleCols[col] ? "Hide" : "Show"} ${col} column`}
                        type="button"
                      >
                        {visibleCols[col] ? "Hide" : "Show"}
                      </button>
                    </div>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {sortedWords.map((word, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <td className="border p-2 text-center sticky left-0 bg-white dark:bg-gray-900 z-0 whitespace-nowrap">
                  {idx + 1}
                </td>

                {/* Render all columns, blank if hidden */}
                {(["romaji", "nihongo", "english", "bangla"] as (keyof Word)[]).map(
                  (col) => (
                    <td key={col} className="border p-2">
                      {visibleCols[col] ? word[col] : ""}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VocabularyPractice;

import React, { useState, useEffect, useRef } from "react";
import listeningDataRaw from "../data/listening.json";

type AudioFile = {
  id: number;
  name: string;
  url: string;
  answer: string;
};

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

const CustomDropdown: React.FC<{
  options: AudioFile[];
  value: number;
  onChange: (id: number) => void;
}> = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-md mx-auto mt-6">
      {/* Label above dropdown */}
      <label
        htmlFor="custom-dropdown-button"
        className="block pt-6 mb-2 text-gray-700 dark:text-gray-100 font-semibold select-none"
      >
        Select Track to Listen
      </label>

      <button
        id="custom-dropdown-button"
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 text-left
          bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-rose-600
          flex justify-between items-center
          text-gray-900 dark:text-gray-100
        "
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="custom-dropdown-label"
      >
        <span id="custom-dropdown-label" className="truncate">
          {selected ? selected.name.replace(/_/g, " ") : "Select a track"}
        </span>
        <span className="ml-2 text-gray-500 dark:text-gray-400 select-none">▼</span>
      </button>

      {open && (
        <ul
          className="absolute z-20 mt-1 max-h-44 w-full overflow-y-auto rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg"
          role="listbox"
          tabIndex={-1}
        >
          {options.map(({ id, name }) => (
            <li
              key={id}
              onClick={() => {
                onChange(id);
                setOpen(false);
              }}
              className={`cursor-pointer px-4 py-2 truncate hover:bg-gray-200 dark:hover:bg-gray-700
                ${id === value ? "bg-rose-400 text-gray-900  dark:bg-rose-600 dark:text-white" : ""}
              `}
              role="option"
              aria-selected={id === value}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onChange(id);
                  setOpen(false);
                }
              }}
            >
              {name.replace(/_/g, " ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Listening: React.FC = () => {
  const audioFiles: AudioFile[] = listeningDataRaw;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1); // 0 to 1

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Load metadata (duration)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setCurrentTime(0);
    };
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [currentIndex]);

  // Update currentTime as audio plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      setIsPlaying(false);
      // Auto play next track on end
      setCurrentIndex((idx) => (idx + 1) % audioFiles.length);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentIndex, audioFiles.length]);

  // Sync volume to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = volume === 0;
    }
  }, [volume]);

  // Play or pause audio
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  // Skip to previous track
  const playPrev = () => {
    setCurrentIndex((idx) => (idx - 1 + audioFiles.length) % audioFiles.length);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Skip to next track
  const playNext = () => {
    setCurrentIndex((idx) => (idx + 1) % audioFiles.length);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Seek audio to clicked position in progress bar
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    const seekTime = ratio * duration;

    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Volume controls
  const toggleMute = () => {
    setVolume((v) => (v === 0 ? 1 : 0));
  };
  const volumeUp = () => {
    setVolume((v) => Math.min(1, v + 0.1));
  };
  const volumeDown = () => {
    setVolume((v) => Math.max(0, v - 0.1));
  };

  // Track title, remove underscores, capitalize words
  const trackTitle = audioFiles[currentIndex].name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="max-w-3xl mx-auto p-10 min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 select-none">
      <h1 className="text-2xl md:text-4xl font-extrabold mb-10 text-center select-none">
        🎧 Listening Practice 🎶
      </h1>

      {/* Audio Player Container */}
      <div
        className="p-6 rounded-xl shadow-lg bg-gray-700 dark:bg-gray-200 border-4 border-transparent
          animate-gradient-border transition-colors duration-500 flex flex-col items-center"
      >
        {/* Player Header with Icon */}
        <div className="flex items-center gap-3 mb-4">
          <span
            aria-hidden="true"
            className="text-4xl text-rose-400 dark:text-rose-600 select-none"
          >
            🎵
          </span>
          <div
            className="text-xl md:text-2xl font-semibold tracking-wide truncate text-gray-200 dark:text-gray-700 max-w-xs"
            aria-label="Current track title"
          >
            {trackTitle}
          </div>
        </div>

        <audio
          ref={audioRef}
          src={audioFiles[currentIndex].url}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          style={{ display: "none" }} // Hide native controls, using custom instead
        />

        {/* Progress Bar */}
        <div
          ref={progressRef}
          onClick={seek}
          className="relative w-full h-3 rounded-full bg-gray-500 dark:bg-gray-700 cursor-pointer mb-6"
          aria-label="Audio progress bar"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          tabIndex={0}
          onKeyDown={(e) => {
            if (!audioRef.current) return;
            let seekTime = currentTime;
            if (e.key === "ArrowRight") {
              seekTime = Math.min(duration, currentTime + 5);
            } else if (e.key === "ArrowLeft") {
              seekTime = Math.max(0, currentTime - 5);
            }
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
          }}
        >
          <div
            className="h-3 rounded-full bg-rose-400 transition-all duration-200"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        {/* Time Display */}
        <div className="w-full flex justify-between text-sm font-mono text-gray-200 dark:text-gray-700 mb-6 px-1 select-text">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex flex-nowrap gap-4 justify-center items-center">
          {/* Previous */}
          <button
            onClick={playPrev}
            className="text-2xl sm:text-3xl hover:text-sakura-400 transition flex-shrink-0"
            aria-label="Previous track"
            title="Previous Track ⏮️"
          >
            ⏮️
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="text-3xl sm:text-5xl hover:text-sakura-500 transition flex-shrink-0"
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause ⏸️" : "Play ▶️"}
          >
            {isPlaying ? "⏸️" : "▶️"}
          </button>

          {/* Next */}
          <button
            onClick={playNext}
            className="text-2xl sm:text-3xl hover:text-sakura-400 transition flex-shrink-0"
            aria-label="Next track"
            title="Next Track ⏭️"
          >
            ⏭️
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={toggleMute}
            className="text-xl sm:text-2xl hover:text-sakura-400 transition flex-shrink-0"
            aria-label={volume === 0 ? "Unmute" : "Mute"}
            title={volume === 0 ? "Unmute 🔈" : "Mute 🔇"}
          >
            {volume === 0 ? "🔇" : "🔈"}
          </button>

          {/* Volume Down */}
          <button
            onClick={volumeDown}
            className="text-xl sm:text-2xl hover:text-sakura-400 transition hidden sm:inline-block flex-shrink-0"
            aria-label="Volume down"
            title="Volume Down 🔉"
          >
            🔉
          </button>

          {/* Volume Up */}
          <button
            onClick={volumeUp}
            className="text-xl sm:text-2xl hover:text-red-400 transition hidden sm:inline-block flex-shrink-0"
            aria-label="Volume up"
            title="Volume Up 🔊"
          >
            🔊
          </button>
        </div>

      </div>

      {/* Custom Dropdown below player */}
      <CustomDropdown
        options={audioFiles}
        value={audioFiles[currentIndex].id}
        onChange={(id) => {
          const newIndex = audioFiles.findIndex((f) => f.id === id);
          if (newIndex !== -1) {
            setCurrentIndex(newIndex);
            setIsPlaying(false);
            setCurrentTime(0);
          }
        }}
      />

      {/* Instruction box */}
      <div
        className="mt-10 p-6 text-center rounded-lg border border-dashed border-gray-500 dark:border-gray-400
          bg-gray-100 dark:bg-gray-800 font-medium select-none text-gray-900 dark:text-gray-100"
      >
        🎧 Listen carefully and enjoy the audio practice!
        <br />
        (Answer input is disabled as this lesson does not have answers.)
      </div>

      <style>{`
        @keyframes gradient-border {
          0% {
            border-color: #f43f5e; /* rose-400 */
          }
          50% {
            border-color: #be123c; /* rose-600 */
          }
          100% {
            border-color: #f43f5e;
          }
        }
        .animate-gradient-border {
          animation: gradient-border 3s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default Listening;

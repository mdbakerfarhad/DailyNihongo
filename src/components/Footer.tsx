import React from "react";
import { Link } from "react-router-dom";
import { FaChevronCircleRight, FaHeart } from "react-icons/fa";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/hiragana", label: "Hiragana" },
  { to: "/katakana", label: "Katakana" },
  { to: "/kanji", label: "Kanji" },
  { to: "/vocabulary", label: "Vocabulary" },
  { to: "/grammar", label: "Grammar" },
  { to: "/listening", label: "Listening" },
  { to: "/N/A", label: "Writing" },
  { to: "/progress", label: "Progress" },
];

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-300 dark:border-[#072032] py-8 select-none">
      <div className="container mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-gray-700 dark:text-gray-300">
        
        {/* About */}
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Nihongo Practice
          </h3>
          <p className="mb-4 text-sm sm:text-base leading-relaxed">
            Master Japanese Language (日本語) step-by-step with fun, interactive lessons. 
            Your journey from Hiragana to Kanji starts here — one small step every day!
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Quick Links
          </h3>
          <nav aria-label="Footer Navigation">
            <ul className="grid grid-cols-3 gap-y-2 gap-x-6 text-sm sm:text-base justify-center sm:justify-start">
  {quickLinks.map(({ to, label }) => (
    <li key={label}>
      <Link
        to={to}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex items-center justify-start gap-2 hover:text-[#FA4B00] transition duration-300"
      >
        <FaChevronCircleRight aria-hidden="true" />
        {label}
      </Link>
    </li>
  ))}
</ul>
          </nav>
        </div>

        {/* Fun Japanese Fact */}
        <div className="bg-gray-100 dark:bg-[#0d1b2a] p-4 rounded-lg shadow-md text-center sm:text-left">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            🎌 Fun Japanese Fact
          </h3>
          <p className="text-sm sm:text-base leading-relaxed">
            The Japanese word for “thank you” — <span className="font-bold">ありがとう</span> (arigatō) —
            originally comes from a Buddhist term meaning “something rare and precious.”
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 dark:border-[#072032] mt-8 pt-4 text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
        <p>
          © {new Date().getFullYear()} DailyNihongo, All rights reserved.<br/>  
          Designed with{" "}
          <FaHeart className="inline text-[#FA4B00] animate-pulse mx-1" /> by{" "}
          <a
            href="https://www.facebook.com/mdbakerfarhad2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FA4B00] hover:underline"
          >
            Md. Baker
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

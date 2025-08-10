import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

interface LinkBtnProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const LinkBtn: React.FC<LinkBtnProps> = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `relative px-3 py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-[#FA4B00] dark:hover:text-[#FA4B00] transition-colors duration-200
      ${isActive ? "text-[#FA4B00]" : ""}
      `
    }
  >
    {children}
    <span
      className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#FA4B00] rounded transition-all duration-300
      ${window.location.pathname === to ? "opacity-100" : "opacity-0"}
      `}
    />
  </NavLink>
);

const Navbar: React.FC = () => {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileOpen(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/hiragana", label: "Hiragana" },
    { to: "/katakana", label: "Katakana" },
    { to: "/kanji", label: "Kanji" },
    { to: "/not-found", label: "Grammar" },
    { to: "/not-found", label: "Listening" },
    { to: "/not-found", label: "Writing" },
    { to: "/progress", label: "Progress" },
  ];

  return (
    <nav className="backdrop-blur sticky top-0 z-50 border-b border-gray-200 dark:border-[#072032]">
      <div className="container mx-auto px-5 py-3 flex items-center justify-between">
        {/* Logo & Home Link */}
        <NavLink
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center text-white font-bold shadow-lg text-xl">
            日
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              DailyNihongo
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-300">
              Practice Hiragana • Katakana • Kanji
            </div>
          </div>
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(({ to, label }) => (
            <LinkBtn key={to} to={to}>
              {label}
            </LinkBtn>
          ))}

          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="ml-6 px-4 py-2 rounded-full bg-[#FA4B00] text-white font-semibold hover:bg-[#d94400] transition-colors duration-200 flex items-center gap-2 select-none"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="px-3 py-2 rounded-full bg-[#FA4B00] text-white font-semibold hover:bg-[#d94400] transition-colors duration-200 select-none"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <button
            onClick={toggleMobile}
            aria-label="Toggle menu"
            className="text-gray-900 dark:text-gray-100 focus:outline-none"
          >
            {mobileOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-[#021222] border-t border-gray-200 dark:border-[#072032]">
          <div className="flex flex-col px-5 py-4 gap-3">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => {
                  closeMobileMenu();
                }}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded font-medium text-gray-700 dark:text-gray-300 hover:bg-[#FA4B00] hover:text-white transition-colors duration-200 ${
                    isActive ? "bg-[#FA4B00] text-white" : ""
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

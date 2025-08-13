import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
      `relative px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:text-[#FA4B00] dark:hover:text-[#FA4B00] transition-colors duration-200 ${
        isActive ? "text-[#FA4B00]" : ""
      }`
    }
  >
    {children}
    <span
      className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#FA4B00] rounded transition-all duration-300 ${
        window.location.pathname === to ? "opacity-100" : "opacity-0"
      }`}
    />
  </NavLink>
);

const Navbar: React.FC = () => {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownHover, setDropdownHover] = useState(false);
  const location = useLocation();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileBtnRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const hoverCloseTimer = useRef<number | null>(null);
  const openHover = () => {
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
    setDropdownHover(true);
  };
  const scheduleCloseHover = () => {
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    hoverCloseTimer.current = window.setTimeout(() => {
      setDropdownHover(false);
      hoverCloseTimer.current = null;
    }, 120);
  };

  const links = [
    { to: "/vocabulary", label: "Vocabulary" },
    { to: "/grammar", label: "Grammar" },
    { to: "/listening", label: "Listening" },
    { to: "/not-found", label: "Writing" },
    { to: "/progress", label: "Progress" },
  ];

  const isPracticeCharactersActive = ["/hiragana", "/katakana", "/kanji"].includes(location.pathname);

  const toggleMobile = () => {
    setDropdownOpen(false);
    setMobileOpen((prev) => !prev);
  };

  const closeMenus = () => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setDropdownHover(false);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        mobileBtnRef.current &&
        !mobileBtnRef.current.contains(target)
      ) {
        closeMenus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-[#072032] bg-white dark:bg-[#021222]">
      <div className="container mx-auto px-4 sm:px-5 py-3 flex items-center justify-between flex-nowrap">
        {/* Logo */}
        <NavLink to="/" onClick={closeMenus} className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-700 flex items-center justify-center text-white font-bold shadow-lg text-lg sm:text-xl">
            日
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white">DailyNihongo</span>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
              Practice Hiragana • Katakana • Kanji
            </span>
          </div>
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 flex-nowrap">
          <LinkBtn to="/" onClick={() => setDropdownOpen(false)}>Home</LinkBtn>

          {/* Practice Characters Dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={openHover}
            onMouseLeave={scheduleCloseHover}
          >
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={`px-3 py-2 text-base font-medium transition-colors duration-200 ${
                isPracticeCharactersActive
                  ? "text-[#FA4B00]"
                  : "text-gray-700 dark:text-white hover:text-[#FA4B00] dark:hover:text-[#FA4B00]"
              }`}
              aria-haspopup="true"
              aria-expanded={dropdownOpen || dropdownHover}
            >
              Practice Characters ▼
            </button>

            <div
              className={`absolute top-full mt-2 w-44 bg-white dark:bg-[#021222] border border-gray-200 dark:border-[#072032] rounded shadow-lg overflow-hidden z-50 transition-all duration-200 origin-top ${
                dropdownOpen || dropdownHover
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
              onMouseEnter={openHover}
              onMouseLeave={scheduleCloseHover}
            >
              {["hiragana", "katakana", "kanji"].map((char) => (
                <NavLink
                  key={char}
                  to={`/${char}`}
                  onClick={() => setDropdownOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-base transition-colors duration-150 ${
                      isActive
                        ? "text-[#FA4B00] bg-gray-200 dark:bg-gray-700"
                        : "hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                    }`
                  }
                >
                  {char.charAt(0).toUpperCase() + char.slice(1)}
                </NavLink>
              ))}
            </div>
          </div>

          {links.map(({ to, label }) => (
            <LinkBtn key={to} to={to} onClick={() => setDropdownOpen(false)}>
              {label}
            </LinkBtn>
          ))}

          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="ml-6 px-4 py-2 rounded-full bg-[#FA4B00] text-white font-semibold hover:bg-[#d94400] transition-colors duration-200 flex items-center gap-2 select-none"
          >
            {theme === "dark" ? "☀️" : "🌙"}
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
            ref={mobileBtnRef}
            onClick={toggleMobile}
            aria-label="Toggle menu"
            className="text-gray-900 dark:text-gray-100 focus:outline-none"
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div ref={mobileMenuRef} className="md:hidden px-4 sm:px-5 pb-4 bg-white dark:bg-[#021222] border-t border-gray-200 dark:border-[#072032] transition-all duration-200">
          <nav className="flex flex-col space-y-2">
            <NavLink
              to="/"
              onClick={closeMenus}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-base font-medium text-gray-700 dark:text-white hover:bg-[#FA4B00] hover:text-white ${
                  isActive ? "bg-[#FA4B00] text-white" : ""
                }`
              }
            >
              Home
            </NavLink>

            <details open={isPracticeCharactersActive}>
              <summary className="cursor-pointer px-3 py-2 rounded text-base font-medium text-gray-700 dark:text-white hover:bg-[#FA4B00] hover:text-white">
                Practice Characters
              </summary>
              <div className="pl-4 flex flex-col gap-1 px-3 py-2 rounded text-base">
                {["hiragana", "katakana", "kanji"].map((char) => (
                  <NavLink
                    key={char}
                    to={`/${char}`}
                    onClick={closeMenus}
                    className={({ isActive }) =>
                      `px-3 py-2 text-sm ${isActive ? "bg-[#FA4B00] text-white font-semibold rounded" : "dark:text-white"}`
                    }
                  >
                    {char.charAt(0).toUpperCase() + char.slice(1)}
                  </NavLink>
                ))}
              </div>
            </details>

            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMenus}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-[#FA4B00] hover:text-white ${
                    isActive ? "bg-[#FA4B00] text-white" : ""
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

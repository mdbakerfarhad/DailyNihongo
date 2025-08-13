import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Hiragana from "./pages/Hiragana";
import Katakana from "./pages/Katakana";
import Kanji from "./pages/Kanji";
import Vocabulary from "./pages/Vocabulary";
import Grammar from "./pages/Grammar";
import Listening from "./pages/Listening";
import Writing from "./pages/Writing";
import Progress from "./pages/Progress";
import Error404 from "./pages/Error404";
import ScrollToTop from "./components/ScrollToTop";
import { AnimatePresence, motion } from "framer-motion";

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => (
  <motion.main
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.18 }}
    className="container mx-auto px-4 py-8"
  >
    {children}
  </motion.main>
);

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-[#071124] transition-colors">
      <ScrollToTop />
      <Navbar />
      
      {/* AnimatePresence must have location and key to work on route change */}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/hiragana" element={<PageWrapper><Hiragana /></PageWrapper>} />
          <Route path="/katakana" element={<PageWrapper><Katakana /></PageWrapper>} />
          <Route path="/kanji" element={<PageWrapper><Kanji /></PageWrapper>} />
          <Route path="/vocabulary" element={<PageWrapper><Vocabulary /></PageWrapper>} />
          <Route path="/grammar" element={<PageWrapper><Grammar /></PageWrapper>} />
          <Route path="/listening" element={<PageWrapper><Listening /></PageWrapper>} />
          <Route path="/writing" element={<PageWrapper><Writing /></PageWrapper>} />
          <Route path="/progress" element={<PageWrapper><Progress /></PageWrapper>} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default App;

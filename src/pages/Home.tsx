import React from "react";
import { Link } from "react-router-dom";

const NUM_PETALS = 30;

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const Home: React.FC = () => {
  // Generate petals with random horizontal position and delay
  const petals = Array.from({ length: NUM_PETALS }).map(() => ({
    left: `${randomBetween(0, 100)}vw`,
    delay: `${randomBetween(0, 10)}s`,
    duration: `${randomBetween(6, 12)}s`,
    size: randomBetween(20, 40), // size in px
  }));

  return (
    <section className="relative min-h-screen flex items-center justify-center backdrop-blur-sm px-6 py-20 md:py-40 overflow-hidden bg-gray-200 dark:bg-slate-800  shadow-lg rounded-lg">
      {/* Responsive container */}
      <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24 max-w-6xl w-full z-10">
        {/* Text content */}
        <div className="flex-1 max-w-xl md:max-w-none text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#12315a] dark:text-white drop-shadow-lg leading-tight">
           🎌 Practice Japanese Language (日本語){" "}
            <span className="text-3xl md:text-4xl font-extrabold text-[#12315a] dark:text-white drop-shadow-lg leading-tight">
              — Make It a Daily Journey to Fluency
            </span>
          </h1>
          <p className="mt-8 text-lg md:text-2xl max-w-full text-gray-700 dark:text-gray-300 text-center md:text-justify">
            Begin your Japanese Language (日本語 - Nihongo) learning with the
            fundamentals: Hiragana (ひらがな) and Katakana (カタカナ). Progress
            smoothly into mastering Kanji (漢字) and Grammar (文法) with
            structured, bite-sized daily sessions designed for consistent growth.
            Transform irregular study habits into a productive routine and unlock
            your full language potential with engaging and effective practice
            every day. <br/><br/>
            Now Start With Hiragana (ひらがな) and Katakana (カタカナ) to build a solid foundation for your Japanese language journey!<br/> <br/><span className="mt-8 text-lg md:text-2xl max-w-full text-[#464700] dark:text-[#eff303] text-center md:text-justify">Click Below button to practice Hiragana (ひらがな) and Katakana (カタカナ).</span>
          </p>
          <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-6">
            <Link to="/hiragana"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FA4B00] to-[#f97316] text-white font-bold shadow-lg hover:from-[#e03e00] hover:to-[#c26012] transition-colors duration-300 select-none"
            >
              Start Hiragana
            </Link>
            <Link to="/katakana"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FA4B00] to-[#f97316] text-white font-bold shadow-lg hover:from-[#e03e00] hover:to-[#c26012] transition-colors duration-300 select-none"
            >
              Start Katakana
            </Link>
          </div>
        </div>

        {/* Japanese character */}
        <div
          aria-label="Japanese character 日"
          className="w-64 h-64 rounded-3xl bg-gradient-to-tr from-[#fbc9d4] to-[#12315a] flex items-center justify-center text-9xl text-white font-extrabold shadow-2xl drop-shadow-lg select-none animate-floatUpDown"
          style={{ animationDuration: "6s" }}
        >
          日
        </div>
      </div>

      {/* Petals continuously dropping */}
      {petals.map(({ left, delay, duration, size }, index) => (
        <svg
          key={index}
          className="absolute top-[-50px] fill-petal text-petal"
          viewBox="0 0 24 24"
          style={{
            left,
            width: size,
            height: size,
            animation: `fallingPetal ${duration} linear infinite`,
            animationDelay: delay,
            opacity: 0.8,
          }}
          aria-hidden="true"
        >
          <path
            fill="#ffb6c1"
            d="M12 2C13 6 18 7 20 10 22 13 20 16 17 18 14 20 10 20 7 19 3 18 2 14 3 10 4 7 7 3 12 2z"
          />
        </svg>
      ))}

      {/* Animations */}
      <style>
        {`
          @keyframes fallingPetal {
            0% {
              transform: translateY(-60px) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(110vh) rotate(360deg);
              opacity: 0;
            }
          }

          @keyframes floatUpDown {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
          }

          .animate-floatUpDown {
            animation-name: floatUpDown;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
          }
        `}
      </style>
    </section>
  );
};

export default Home;

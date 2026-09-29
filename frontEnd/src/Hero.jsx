import { useNavigate } from "react-router-dom";
import profile from "./Images/profile.png";
import work from "./assets/work.mp4";
import { useEffect, useState } from "react";

function Hero() {
  // ================= TYPING ANIMATION =================
  const Navigate = useNavigate();
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const fullText = "Hire Expert Developers\nFor Your Digital Project";

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setText(fullText.slice(0, index + 1));
      index++;

      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // ================= COUNTER ANIMATION =================

  const [developers, setDevelopers] = useState(0);
  const [projects, setProjects] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const intervalTime = 20;

    const developerTarget = 500;
    const projectTarget = 120;
    const satisfactionTarget = 98;

    const steps = duration / intervalTime;

    const developerIncrement = developerTarget / steps;
    const projectIncrement = projectTarget / steps;
    const satisfactionIncrement = satisfactionTarget / steps;

    let developerCount = 0;
    let projectCount = 0;
    let satisfactionCount = 0;

    const interval = setInterval(() => {
      developerCount += developerIncrement;
      projectCount += projectIncrement;
      satisfactionCount += satisfactionIncrement;

      if (developerCount >= developerTarget) {
        developerCount = developerTarget;
      }

      if (projectCount >= projectTarget) {
        projectCount = projectTarget;
      }

      if (satisfactionCount >= satisfactionTarget) {
        satisfactionCount = satisfactionTarget;
      }

      setDevelopers(Math.floor(developerCount));
      setProjects(Math.floor(projectCount));
      setSatisfaction(Math.floor(satisfactionCount));

      if (
        developerCount >= developerTarget &&
        projectCount >= projectTarget &&
        satisfactionCount >= satisfactionTarget
      ) {
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section
        id="hero"
        className="relative w-full min-h-[650px] lg:h-[650px] flex flex-col-reverse lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-16 bg-[#10002b] overflow-hidden"
      >
        {/* ================= BACKGROUND VIDEO ================= */}

        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={work} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-gray-900/20 z-10" />
        <div className="relative z-20 w-full lg:w-1/2 text-center lg:text-left lg:mt-0 mb-16">
          <h1
            className="
    text-4xl
    sm:text-5xl
    md:text-5xl
    w-[330px]
     font-bold
    text-white
    leading-tight
    min-h-[240px]
    sm:min-h-[200px]
    md:min-h-[220px]
    
  "
          >
            {text.split("\n").map((line, index) => (
              <span key={index} className="block">
                {line.includes("Digital Project") ? (
                  <>
                    {line.replace("Digital Project", "")}
                    <span className="text-blue-500">Digital Project</span>
                  </>
                ) : (
                  line
                )}

                {/* Cursor */}
                {isTyping && index === text.split("\n").length - 1 && (
                  <span className="text-blue-500 animate-pulse ml-1">|</span>
                )}
              </span>
            ))}
          </h1>
          {/* ================= DESCRIPTION ================= */}

          <p className="text-gray-300 text-base sm:text-lg leading-8 max-w-[650px] mx-auto lg:mx-0">
            Connect with skilled developers. Build websites, AI-powered
            solutions, automation, cloud applications, and secure digital
            products for your business.
          </p>

          {/* ================= BUTTONS ================= */}

          <div className="flex flex-col sm:flex-row gap-5 mt-8 justify-center lg:justify-start">
            <button
              className="
                px-7
                py-3
                bg-blue-600
                text-white
                rounded-xl
                hover:bg-blue-700
                hover:scale-105
                duration-300
                shadow-lg
              "
              onClick={() => Navigate("/register")}
            >
              Hire Developer
            </button>

            <button
              className="
                px-7
                py-3
                border
                border-white
                text-white
                rounded-xl
                hover:bg-white
                hover:text-purple-900
                hover:scale-105
                duration-300
              "
              onClick={() =>
                document.getElementById("services")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Explore Services
            </button>
          </div>

          {/* ================= STATS ================= */}

          <div className="flex flex-wrap justify-center lg:justify-start gap-8 sm:gap-12 mt-8">
            {/* DEVELOPERS */}

            <div>
              <h2 className="text-3xl font-bold text-white">{developers}+</h2>

              <p className="text-gray-400 mt-2">Developers</p>
            </div>

            {/* PROJECTS */}

            <div>
              <h2 className="text-3xl font-bold text-white">{projects}+</h2>

              <p className="text-gray-400 mt-2">Projects Completed</p>
            </div>

            {/* CLIENT SATISFACTION */}

            <div>
              <h2 className="text-3xl font-bold text-white">{satisfaction}%</h2>

              <p className="text-gray-400 mt-2">Client Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Right Image */}
      </section>
    </>
  );
}

export default Hero;
